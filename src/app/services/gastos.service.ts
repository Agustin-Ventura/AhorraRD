import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NetworkService } from './network.service';

// Definimos cómo se ve un "gasto" en la app
export interface Gasto {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  sincronizado: boolean; // true = ya está en el servidor; false = pendiente
}

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  private _storage: Storage | null = null;
  private readonly CLAVE = 'gastos'; // nombre con el que guardamos la lista

  constructor(
    private storage: Storage,
    private networkService: NetworkService
  ) {
    this.init();
  }

  /** Prepara el almacenamiento al iniciar */
  private async init(): Promise<void> {
    this._storage = await this.storage.create();

    // Escuchamos la conexión: cuando vuelve el internet, sincronizamos lo pendiente
    this.networkService.estadoConexion$.subscribe((online: boolean) => {
      if (online) {
        this.sincronizarPendientes();
      }
    });
  }

  /** Devuelve todos los gastos guardados */
  public async obtenerGastos(): Promise<Gasto[]> {
    const gastos = await this._storage?.get(this.CLAVE);
    return gastos || [];
  }

  /**
   * Registra un gasto nuevo.
   * Si hay internet -> se marca como sincronizado (simulamos envío al servidor).
   * Si NO hay internet -> se guarda como pendiente (sincronizado = false).
   */
  public async agregarGasto(descripcion: string, monto: number): Promise<void> {
    const gastos = await this.obtenerGastos();
    const hayInternet = this.networkService.estaEnLinea();

    const nuevoGasto: Gasto = {
      id: Date.now(), // id único basado en la hora
      descripcion: descripcion,
      monto: monto,
      fecha: new Date().toLocaleString(),
      sincronizado: hayInternet // si hay internet queda sincronizado de una vez
    };

    gastos.push(nuevoGasto);
    await this._storage?.set(this.CLAVE, gastos);
  }

  /**
   * Sincroniza los gastos pendientes cuando vuelve la conexión.
   * Aquí simulamos el "envío al servidor" marcándolos como sincronizados.
   */
  public async sincronizarPendientes(): Promise<void> {
    const gastos = await this.obtenerGastos();
    let huboCambios = false;

    for (const gasto of gastos) {
      if (!gasto.sincronizado) {
        // Aquí iría la llamada real al servidor (API). Lo simulamos:
        gasto.sincronizado = true;
        huboCambios = true;
      }
    }

    if (huboCambios) {
      await this._storage?.set(this.CLAVE, gastos);
      console.log('Gastos pendientes sincronizados correctamente.');
    }
  }

  /** Cuenta cuántos gastos están pendientes de sincronizar */
  public async contarPendientes(): Promise<number> {
    const gastos = await this.obtenerGastos();
    return gastos.filter(g => !g.sincronizado).length;
  }
}