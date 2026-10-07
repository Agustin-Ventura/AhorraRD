import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NetworkService } from './network.service';

export interface Gasto {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  sincronizado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  private _storage: Storage | null = null;
  private readonly CLAVE = 'gastos';

  constructor(
    private storage: Storage,
    private networkService: NetworkService
  ) {
    this.init();
  }

  private async init(): Promise<void> {
    this._storage = await this.storage.create();

    this.networkService.estadoConexion$.subscribe((online: boolean) => {
      if (online) {
        this.sincronizarPendientes();
      }
    });
  }

  /** READ: devuelve todos los gastos guardados */
  public async obtenerGastos(): Promise<Gasto[]> {
    const gastos = await this._storage?.get(this.CLAVE);
    return gastos || [];
  }

  /** CREATE: registra un gasto nuevo */
  public async agregarGasto(descripcion: string, monto: number): Promise<void> {
    const gastos = await this.obtenerGastos();
    const hayInternet = this.networkService.estaEnLinea();

    const nuevoGasto: Gasto = {
      id: Date.now(),
      descripcion: descripcion,
      monto: monto,
      fecha: new Date().toLocaleString(),
      sincronizado: hayInternet
    };

    gastos.push(nuevoGasto);
    await this._storage?.set(this.CLAVE, gastos);
  }

  /** UPDATE: modifica un gasto existente por su id */
  public async actualizarGasto(id: number, descripcion: string, monto: number): Promise<void> {
    const gastos = await this.obtenerGastos();
    const gasto = gastos.find(g => g.id === id);
    if (gasto) {
      gasto.descripcion = descripcion;
      gasto.monto = monto;
      await this._storage?.set(this.CLAVE, gastos);
    }
  }

  /** DELETE: elimina un gasto por su id */
  public async eliminarGasto(id: number): Promise<void> {
    let gastos = await this.obtenerGastos();
    gastos = gastos.filter(g => g.id !== id);
    await this._storage?.set(this.CLAVE, gastos);
  }

  /** Sincroniza los gastos pendientes cuando vuelve la conexión */
  public async sincronizarPendientes(): Promise<void> {
    const gastos = await this.obtenerGastos();
    let huboCambios = false;

    for (const gasto of gastos) {
      if (!gasto.sincronizado) {
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