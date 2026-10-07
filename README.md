# AhorraRD

**Aplicación móvil de finanzas personales** desarrollada con Ionic, Angular y Capacitor.

AhorraRD permite registrar y controlar gastos personales de forma sencilla, con funcionamiento **en línea y sin conexión**, pensada para estudiantes y jóvenes trabajadores dominicanos.

> Proyecto Práctico Final — Asignatura **Programación de Dispositivos Móviles (ISW-307)**
> Universidad Abierta para Adultos (UAPA) — Grupo D

---

## Funcionalidades

La aplicación integra las **10 unidades** de la asignatura:

| # | Unidad | Funcionalidad en AhorraRD |
|---|--------|---------------------------|
| 1-2 | Navegación | Barra de 5 pestañas con enrutamiento y *lazy loading* |
| 3 | Gestos | Deslizar para eliminar (*swipe*) y *pull-to-refresh* |
| 4 | Conectividad | Banner de estado en línea / sin conexión en tiempo real |
| 5 | Bluetooth | Escaneo de dispositivos BLE cercanos |
| 6 | Geolocalización | Mapa interactivo con GPS y marcadores de bancos |
| 7 | Multimedia | Reproductor de podcasts de educación financiera |
| 8 | Cámara | Foto de perfil con `@capacitor/camera` |
| 9 | Almacenamiento | CRUD completo de gastos con persistencia local |
| 10 | API REST | Tasa de cambio del dólar (USD → DOP) en vivo |

**Modo offline:** los gastos registrados sin conexión se guardan localmente y se **sincronizan automáticamente** al recuperar internet.

---

## Tecnologías

- **Ionic 9** — componentes de interfaz
- **Angular** (standalone components)
- **Capacitor** — acceso a funciones nativas
- **TypeScript**
- **Leaflet** — mapas interactivos
- **RxJS** — manejo reactivo de la conectividad

### Plugins de Capacitor

| Plugin | Uso |
|--------|-----|
| `@capacitor/network` | Detectar estado de la conexión |
| `@ionic/storage-angular` | Base de datos local (gastos y perfil) |
| `@capacitor/geolocation` | Ubicación GPS para el mapa |
| `@capacitor/camera` | Foto de perfil |
| `@capacitor-community/bluetooth-le` | Escaneo de dispositivos Bluetooth |

---

## Instalación y ejecución

**Requisitos previos:** [Node.js](https://nodejs.org) (v18 o superior), [Ionic CLI](https://ionicframework.com/docs/cli) y [Git](https://git-scm.com).

```bash
# 1. Clonar el repositorio
git clone https://github.com/Agustin-Ventura/AhorraRD.git

# 2. Entrar a la carpeta
cd AhorraRD

# 3. Instalar las dependencias
npm install

# 4. Ejecutar en el navegador
ionic serve
```

La aplicación abrirá en `http://localhost:8100`.

> Si no tienes el Ionic CLI instalado: `npm install -g @ionic/cli`

---

## Estructura del proyecto

```
src/
└── app/
    ├── tabs/                 # Barra de navegación (pestañas)
    ├── home/                 # Pestaña Gastos: CRUD + conectividad
    ├── pages/
    │   ├── inicio/           # Resumen + tasa del dólar (API REST)
    │   ├── mapa/             # GPS + mapa Leaflet
    │   ├── recursos/         # Reproductor de podcasts
    │   └── perfil/           # Cámara + Bluetooth
    ├── services/
    │   ├── network.service.ts   # Detección de conectividad
    │   ├── gastos.service.ts    # CRUD de gastos
    │   └── tasa.service.ts      # Consumo de API REST
    ├── app.routes.ts         # Enrutamiento con lazy loading
    └── main.ts               # Configuración y providers
```

---

## quipo — Grupo D

| Integrante | Rol | Módulos |
|------------|-----|---------|
| Agustín Alberto Ventura Méndez | Líder técnico | Inicio/API REST, Bluetooth/Perfil, integración |
| Francis Mejía De León | Diseñador de interfaz | Conectividad y Mapa |
| Eddy Junior Mendoza Rojas | Programador funcional | Gastos, gestos y almacenamiento |
| Jayson Enrique Peña Ferreras | Documentador / Tester | Multimedia y Cámara, pruebas |

**Facilitador:** Joan Manuel Gregorio Pérez

---

## Licencia

Proyecto académico desarrollado con fines educativos para la UAPA.
© 2026 Grupo D — Todos los derechos reservados.
