import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonList, IonBadge, IonNote
} from '@ionic/angular';
import { NetworkService } from '../services/network.service';
import { GastosService, Gasto } from '../services/gastos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton, IonList, IonBadge, IonNote
  ],
})
export class HomePage implements OnInit {

  public estaEnLinea: boolean = true;

  // Campos del formulario (se enlazan con los inputs del HTML)
  public descripcion: string = '';
  public monto: number | null = null;

  public gastos: Gasto[] = [];   // lista de gastos para mostrar
  public pendientes: number = 0; // cuántos faltan por sincronizar

  constructor(
    private networkService: NetworkService,
    private gastosService: GastosService
  ) {}

  ngOnInit(): void {
    // Escuchamos el estado de la conexión para el banner
    this.networkService.estadoConexion$.subscribe(async (online: boolean) => {
      this.estaEnLinea = online;
      // Al reconectar, damos un momento para que sincronice y refrescamos la lista
      if (online) {
        setTimeout(() => this.cargarGastos(), 1000);
      }
    });

    this.cargarGastos();
  }

  /** Registra un gasto usando el servicio */
  public async registrarGasto(): Promise<void> {
    // Validación simple: que haya descripción y monto válido
    if (!this.descripcion.trim() || !this.monto || this.monto <= 0) {
      return;
    }

    await this.gastosService.agregarGasto(this.descripcion, this.monto);

    // Limpiamos el formulario y recargamos la lista
    this.descripcion = '';
    this.monto = null;
    await this.cargarGastos();
  }

  /** Trae los gastos y cuenta los pendientes */
  public async cargarGastos(): Promise<void> {
    this.gastos = await this.gastosService.obtenerGastos();
    this.pendientes = await this.gastosService.contarPendientes();
  }
}