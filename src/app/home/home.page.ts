import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
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

  public descripcion: string = '';
  public monto: number | null = null;

  public gastos: Gasto[] = [];
  public pendientes: number = 0;

  constructor(
    private networkService: NetworkService,
    private gastosService: GastosService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.networkService.estadoConexion$.subscribe((online: boolean) => {
      this.zone.run(() => {
        this.estaEnLinea = online;
        this.cdr.detectChanges(); // fuerza a Angular a repintar la pantalla YA
        if (online) {
          setTimeout(() => this.cargarGastos(), 1000);
        }
      });
    });

    this.cargarGastos();
  }

  public async registrarGasto(): Promise<void> {
    if (!this.descripcion.trim() || !this.monto || this.monto <= 0) {
      return;
    }
    await this.gastosService.agregarGasto(this.descripcion, this.monto);
    this.descripcion = '';
    this.monto = null;
    await this.cargarGastos();
  }

  public async cargarGastos(): Promise<void> {
    this.gastos = await this.gastosService.obtenerGastos();
    this.pendientes = await this.gastosService.contarPendientes();
    this.cdr.detectChanges(); // fuerza el repintado de la lista
  }
}