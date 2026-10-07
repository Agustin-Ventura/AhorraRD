import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonAvatar
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, personCircleOutline, saveOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardContent, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonAvatar
  ],
})
export class PerfilPage implements OnInit {

  public fotoPerfil: string | null = null; // imagen en base64
  public nombre: string = '';
  public carrera: string = '';
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    addIcons({ cameraOutline, personCircleOutline, saveOutline });
  }

  async ngOnInit(): Promise<void> {
    this._storage = await this.storage.create();
    // Cargar datos guardados del perfil, si existen
    this.fotoPerfil = await this._storage.get('perfil_foto');
    this.nombre = (await this._storage.get('perfil_nombre')) || '';
    this.carrera = (await this._storage.get('perfil_carrera')) || '';
  }

  /** Toma una foto con la cámara (o galería) */
  public async tomarFoto(): Promise<void> {
    try {
      const imagen = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // devuelve la imagen como texto base64
        source: CameraSource.Prompt,          // deja elegir cámara o galería
      });

      this.fotoPerfil = imagen.dataUrl || null;
      await this._storage?.set('perfil_foto', this.fotoPerfil); // guardar
    } catch (error) {
      console.log('El usuario canceló o hubo un error:', error);
    }
  }

  /** Guarda el nombre y la carrera */
  public async guardarPerfil(): Promise<void> {
    await this._storage?.set('perfil_nombre', this.nombre);
    await this._storage?.set('perfil_carrera', this.carrera);
    alert('Perfil guardado correctamente.');
  }
}