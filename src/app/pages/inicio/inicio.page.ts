import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonSpinner, IonButton, IonIcon
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { refreshOutline, trendingUpOutline } from 'ionicons/icons';
import { TasaService } from '../../services/tasa.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonSpinner, IonButton, IonIcon
  ],
})
export class InicioPage implements OnInit {

  public tasaDolar: number | null = null; // valor USD -> DOP
  public fecha: string = '';
  public cargando: boolean = false;       // controla el spinner
  public error: boolean = false;          // controla el mensaje de error

  constructor(private tasaService: TasaService) {
    addIcons({ refreshOutline, trendingUpOutline });
  }

  ngOnInit(): void {
    this.cargarTasa();
  }

  /** Llama a la API y maneja carga, éxito y error */
  public cargarTasa(): void {
    this.cargando = true;
    this.error = false;

    this.tasaService.obtenerTasaDolar().subscribe({
      next: (data) => {
        // La API devuelve { usd: { dop: 60.1, ... } }
        this.tasaDolar = data.usd.dop;
        this.fecha = data.date;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener la tasa:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }
}