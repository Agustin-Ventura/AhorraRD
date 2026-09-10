import { Injectable } from '@angular/core';
import { Network, ConnectionStatus } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private online$ = new BehaviorSubject<boolean>(true);

  constructor() {
    this.inicializar();
  }

  private async inicializar(): Promise<void> {
    console.log('>>> NetworkService NUEVO cargado con bloque 3 <<<');

    const estado = await Network.getStatus();
    this.online$.next(estado.connected);

    Network.addListener('networkStatusChange', (estado: ConnectionStatus) => {
      this.online$.next(estado.connected);
    });

    window.addEventListener('online', () => {
      console.log('>>> Evento ONLINE recibido por el servicio <<<');
      this.online$.next(true);
    });
    window.addEventListener('offline', () => {
      console.log('>>> Evento OFFLINE recibido por el servicio <<<');
      this.online$.next(false);
    });
  }

  public get estadoConexion$() {
    return this.online$.asObservable();
  }

  public estaEnLinea(): boolean {
    return this.online$.value;
  }

  public async obtenerEstadoActual(): Promise<boolean> {
    const estado = await Network.getStatus();
    return estado.connected;
  }
}