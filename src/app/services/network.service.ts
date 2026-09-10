import { Injectable } from '@angular/core';
import { Network, ConnectionStatus } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // El servicio queda disponible en toda la app
})
export class NetworkService {

  // BehaviorSubject guarda el último estado y lo comparte con quien lo escuche.
  // Empezamos asumiendo que SÍ hay conexión (true) hasta comprobar el estado real.
  private online$ = new BehaviorSubject<boolean>(true);

  constructor() {
    this.inicializar();
  }

  /** Configura la detección de red al arrancar la app */
  private async inicializar(): Promise<void> {
    // 1) Leer el estado de la red en el momento en que abre la app
    const estado = await Network.getStatus();
    this.online$.next(estado.connected);

    // 2) Escuchar los cambios de conexión EN TIEMPO REAL
    //    Cada vez que se conecta o desconecta, actualizamos el estado.
    Network.addListener('networkStatusChange', (estado: ConnectionStatus) => {
      this.online$.next(estado.connected);
    });
  }

  /** Los componentes se suscriben a esto para reaccionar a los cambios */
  public get estadoConexion$() {
    return this.online$.asObservable();
  }

  /** Devuelve el estado actual (true = en línea, false = sin conexión) */
  public estaEnLinea(): boolean {
    return this.online$.value;
  }

  /** Consulta directa al plugin, por si se necesita el estado más reciente */
  public async obtenerEstadoActual(): Promise<boolean> {
    const estado = await Network.getStatus();
    return estado.connected;
  }
}