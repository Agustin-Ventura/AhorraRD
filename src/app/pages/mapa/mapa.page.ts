import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonSpinner
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { locateOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonSpinner
  ],
})
export class MapaPage implements AfterViewInit {

  private map!: L.Map;
  private marcadorUsuario!: L.Marker;
  public cargando: boolean = false;

  // Coordenadas de Santo Domingo como punto inicial
  private readonly SANTO_DOMINGO: [number, number] = [18.4861, -69.9312];

  // Marcadores de ejemplo: bancos/cajeros en Santo Domingo
  private puntosInteres = [
    { nombre: 'Banreservas - Sede', lat: 18.4725, lng: -69.9205 },
    { nombre: 'Banco Popular - Piantini', lat: 18.4699, lng: -69.9391 },
    { nombre: 'BHD - Av. 27 de Febrero', lat: 18.4731, lng: -69.9410 },
    { nombre: 'Cajero Scotiabank - Megacentro', lat: 18.4896, lng: -69.8570 },
  ];

  constructor() {
    addIcons({ locateOutline });
  }

  // Se ejecuta cuando la vista ya está lista (el mapa necesita el div visible)
  ngAfterViewInit(): void {
    // Pequeño retraso para asegurar que el contenedor esté renderizado
    setTimeout(() => this.inicializarMapa(), 300);
  }

  /** Crea el mapa y coloca los marcadores de bancos */
  private inicializarMapa(): void {
    this.map = L.map('mapa').setView(this.SANTO_DOMINGO, 13);

    // Capa base de OpenStreetMap (gratuita)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    // Colocar los marcadores de bancos/cajeros
    this.puntosInteres.forEach((punto) => {
      L.marker([punto.lat, punto.lng])
        .addTo(this.map)
        .bindPopup('<b>' + punto.nombre + '</b>');
    });
  }

  /** Obtiene la ubicación actual del usuario con GPS */
  public async ubicarme(): Promise<void> {
    this.cargando = true;
    try {
      const posicion = await Geolocation.getCurrentPosition();
      const lat = posicion.coords.latitude;
      const lng = posicion.coords.longitude;

      // Centrar el mapa en la ubicación del usuario
      this.map.setView([lat, lng], 15);

      // Colocar (o mover) el marcador del usuario
      if (this.marcadorUsuario) {
        this.marcadorUsuario.setLatLng([lat, lng]);
      } else {
        this.marcadorUsuario = L.marker([lat, lng])
          .addTo(this.map)
          .bindPopup('📍 Estás aquí')
          .openPopup();
      }
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      alert('No se pudo obtener tu ubicación. Revisa los permisos de ubicación del navegador.');
    } finally {
      this.cargando = false;
    }
  }
}