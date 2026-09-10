import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {

  // Guarda el estado de la conexión. La pantalla reacciona a este valor.
  public estaEnLinea: boolean = true;

  constructor(private networkService: NetworkService) {}

  ngOnInit(): void {
    // Nos suscribimos al servicio: cada vez que la conexión cambie,
    // se actualiza 'estaEnLinea' y con ello el banner en pantalla.
    this.networkService.estadoConexion$.subscribe((online: boolean) => {
      this.estaEnLinea = online;
    });
  }
}