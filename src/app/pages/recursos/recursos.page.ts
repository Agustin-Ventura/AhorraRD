import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonIcon, IonButton, IonRange, IonCard, IonCardContent
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { playOutline, pauseOutline, stopOutline, musicalNotesOutline } from 'ionicons/icons';

interface Podcast {
  titulo: string;
  autor: string;
  url: string;
}

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.page.html',
  styleUrls: ['./recursos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonIcon, IonButton, IonRange, IonCard, IonCardContent
  ],
})
export class RecursosPage {

  private audio = new Audio(); // reproductor HTML5

  public podcasts: Podcast[] = [
    { titulo: 'Cómo empezar a ahorrar', autor: 'Finanzas Claras', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { titulo: 'Presupuesto 50/30/20', autor: 'Educación Financiera', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { titulo: 'Evita las deudas malas', autor: 'Dinero Inteligente', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ];

  public reproduciendo: boolean = false;
  public tituloActual: string = '';
  public progreso: number = 0;      // 0 a 100
  public tiempoActual: string = '0:00';
  public duracion: string = '0:00';

  constructor() {
    addIcons({ playOutline, pauseOutline, stopOutline, musicalNotesOutline });

    // Actualiza la barra de progreso mientras suena
    this.audio.ontimeupdate = () => {
      if (this.audio.duration) {
        this.progreso = (this.audio.currentTime / this.audio.duration) * 100;
        this.tiempoActual = this.formato(this.audio.currentTime);
        this.duracion = this.formato(this.audio.duration);
      }
    };

    // Al terminar la pista
    this.audio.onended = () => {
      this.reproduciendo = false;
      this.progreso = 0;
    };
  }

  /** Selecciona y reproduce un podcast */
  public reproducir(podcast: Podcast): void {
    if (this.tituloActual !== podcast.titulo) {
      this.audio.src = podcast.url;
      this.tituloActual = podcast.titulo;
    }
    this.audio.play();
    this.reproduciendo = true;
  }

  /** Pausa o reanuda */
  public pausar(): void {
    this.audio.pause();
    this.reproduciendo = false;
  }
    /** Reanuda la reproducción pausada */
  public reanudar(): void {
    this.audio.play();
    this.reproduciendo = true;
  }

  /** Detiene y reinicia */
  public detener(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.reproduciendo = false;
    this.progreso = 0;
  }

  /** Mueve la reproducción al arrastrar la barra */
  public buscar(evento: any): void {
    if (this.audio.duration) {
      this.audio.currentTime = (evento.detail.value / 100) * this.audio.duration;
    }
  }

  /** Convierte segundos a formato minutos:segundos */
  private formato(segundos: number): string {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return min + ':' + (seg < 10 ? '0' : '') + seg;
  }
}