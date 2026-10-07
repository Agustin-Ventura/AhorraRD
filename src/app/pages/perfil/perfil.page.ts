import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonButton, IonIcon, IonItem, IonLabel, IonInput, IonAvatar, IonList, IonSpinner
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, personCircleOutline, saveOutline, bluetoothOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Storage } from '@ionic/storage-angular';
import { BleClient } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonButton, IonIcon, IonItem, IonLabel, IonInput, IonAvatar, IonList, IonSpinner
  ],
})
export class PerfilPage implements OnInit {

  // --- Perfil ---
  public fotoPerfil: string | null = null;
  public nombre: string = '';
  public carrera: string = '';
  private _storage: Storage | null = null;

  // --- Bluetooth ---
  public escaneando: boolean = false;
  public dispositivos: { nombre: string; id: string }[] = [];

  constructor(private storage: Storage) {
    addIcons({ cameraOutline, personCircleOutline, saveOutline, bluetoothOutline });
  }

  async ngOnInit(): Promise<void> {
    this._storage = await this.storage.create();
    this.fotoPerfil = await this._storage.get('perfil_foto');
    this.nombre = (await this._storage.get('perfil_nombre')) || '';
    this.carrera = (await this._storage.get('perfil_carrera')) || '';
  }

  // ---------------- CÁMARA ----------------
  public async tomarFoto(): Promise<void> {
    try {
      const imagen = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });
      this.fotoPerfil = imagen.dataUrl || null;
      await this._storage?.set('perfil_foto', this.fotoPerfil);
    } catch (error) {
      console.log('El usuario canceló o hubo un error:', error);
    }
  }

  public async guardarPerfil(): Promise<void> {
    await this._storage?.set('perfil_nombre', this.nombre);
    await this._storage?.set('perfil_carrera', this.carrera);
    alert('Perfil guardado correctamente.');
  }

  // ---------------- BLUETOOTH (Unidad 5) ----------------
  /** Escanea dispositivos Bluetooth cercanos */
  public async escanearBluetooth(): Promise<void> {
    this.escaneando = true;
    this.dispositivos = [];

    try {
      // Inicializa el Bluetooth
      await BleClient.initialize();

      // Pide al usuario elegir un dispositivo cercano (abre el selector del navegador)
      const dispositivo = await BleClient.requestDevice();

      this.dispositivos.push({
        nombre: dispositivo.name || 'Dispositivo sin nombre',
        id: dispositivo.deviceId,
      });
    } catch (error) {
      console.log('Escaneo cancelado o error:', error);
      alert('No se seleccionó ningún dispositivo o el Bluetooth está apagado.');
    } finally {
      this.escaneando = false;
    }
  }
}