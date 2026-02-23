# Hostalium - Frontend

Aplicación web React para la gestión de reservas de restaurantes Hostalium.

## Descripción

Frontend desarrollado con React 19 y Vite que proporciona una interfaz moderna e intuitiva para gestionar reservas, mesas, horarios y lista de espera.

## Características Principales

- **Dashboard interactivo** con métricas y acciones rápidas
- **Gestión de reservas** - Crear, editar, cancelar y confirmar
- **Visualización de mesas** - Mapa interactivo con React Konva
- **Lista de espera** - Gestión de waitlist con sistema FIFO
- **Configuración de horarios** - Gestión flexible de horarios por día
- **Autenticación** - Login y gestión de sesión
- **Responsive** - Diseño adaptable a diferentes dispositivos
- **UI moderna** - Material-UI + Tailwind CSS

## Stack Tecnológico

- **React 19** - Framework UI
- **Vite** - Build tool y dev server
- **React Router** - Routing
- **Tailwind CSS** - Estilos utility-first
- **Material-UI (MUI)** - Componentes UI
- **React Konva** - Visualización de mesas (canvas)
- **Lucide React** - Iconos
- **React Icons** - Iconos adicionales

## Estructura del Proyecto

```
FRONTEND/
├── src/
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   │
│   ├── pages/               # Páginas/Views
│   │   ├── Home.jsx         # Dashboard principal
│   │   ├── Login.jsx        # Página de login
│   │   ├── CrearReserva.jsx
│   │   ├── VerReservas.jsx
│   │   ├── VerWaitlist.jsx
│   │   ├── Settings.jsx
│   │   └── ...
│   │
│   ├── components/          # Componentes React
│   │   ├── common/          # Componentes comunes
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Toast.jsx
│   │   ├── dashboard/       # Componentes del dashboard
│   │   │   ├── DashboardMetrics.jsx
│   │   │   ├── NextReservation.jsx
│   │   │   └── ...
│   │   ├── reservas/        # Componentes de reservas
│   │   ├── waitlist/        # Componentes de waitlist
│   │   ├── settings/        # Componentes de configuración
│   │   └── layout/          # Layout (Sidebar, Topbar)
│   │
│   ├── services/            # Servicios API
│   │   ├── api.js           # Cliente HTTP base
│   │   ├── auth.js          # Servicio de autenticación
│   │   ├── reservas.js      # Servicio de reservas
│   │   ├── waitlist.js      # Servicio de waitlist
│   │   └── ...
│   │
│   ├── context/             # Context API
│   │   ├── RestaurantContext.jsx
│   │   ├── ReservasContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── hooks/               # Custom hooks
│   │   └── useModalAnimation.js
│   │
│   └── utils/               # Utilidades
│       ├── dateFormatter.js
│       └── validators.js
│
├── public/                  # Archivos estáticos
│   └── mockup*.png          # Mockups del diseño
│
└── vite.config.js           # Configuración de Vite
```

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz de `FRONTEND/`:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Aplicación en `http://localhost:5173`

## Uso

### Desarrollo

```bash
npm run dev
```

### Build de Producción

```bash
npm run build
```

Los archivos se generan en `dist/`

### Preview del Build

```bash
npm run preview
```

### Linter

```bash
npm run lint
```

## Scripts Disponibles

```bash
npm run dev              # Desarrollo con Vite
npm run build            # Build de producción
npm run preview          # Preview del build
npm run lint             # Ejecutar ESLint
```

## Páginas Principales

### Dashboard (Home)
- Métricas del restaurante
- Próximas reservas
- Acciones rápidas
- Estado del servicio

### Reservas
- **Crear Reserva**: Formulario para crear nuevas reservas
- **Ver Reservas**: Lista de todas las reservas con filtros
- **Editar Reserva**: Modal para editar reservas existentes
- **Cancelar Reserva**: Proceso de cancelación

### Waitlist
- Lista de clientes en espera
- Gestión de entradas
- Procesamiento automático

### Configuración (Settings)
- Gestión de mesas
- Configuración de horarios
- Configuración del restaurante
- Gestión de usuarios

## Componentes Principales

### Layout
- **Sidebar**: Navegación lateral
- **Topbar**: Barra superior con información del usuario

### Dashboard
- **DashboardMetrics**: Métricas principales
- **NextReservation**: Próxima reserva
- **QuickActions**: Acciones rápidas
- **ReservationsPanel**: Panel de reservas

### Reservas
- **ReservaModal**: Modal para crear/editar reservas
- **VerReservaModal**: Modal para ver detalles
- **ListaReservas**: Lista de reservas con filtros

### Waitlist
- **ListarWaitlist**: Lista de entradas de waitlist
- **WaitlistSuccess**: Confirmación de waitlist

## Context API

### RestaurantContext
Gestiona el estado del restaurante actual y usuario autenticado.

### ReservasContext
Gestiona el estado de las reservas (lista, filtros, etc.).

### NotificationContext
Gestiona notificaciones y toasts.

## Servicios API

Todos los servicios están en `src/services/` y usan el cliente HTTP base de `api.js`:

- `auth.js` - Autenticación (login, logout)
- `reservas.js` - CRUD de reservas
- `waitlist.js` - CRUD de waitlist
- `tableService.js` - Gestión de mesas
- `horarios.js` - Gestión de horarios
- `config.js` - Configuración del restaurante
- `dashboard.js` - Métricas del dashboard

## Estilos

### Tailwind CSS
Estilos utility-first con Tailwind CSS. Configuración en `tailwind.config.js`.

### Material-UI
Componentes UI de Material-UI para elementos complejos (modals, cards, etc.).

## Routing

Rutas definidas en `src/routes/`:

- `/` - Dashboard (Home)
- `/login` - Login
- `/reservas` - Gestión de reservas
- `/reservas/crear` - Crear reserva
- `/reservas/:id` - Ver/editar reserva
- `/waitlist` - Lista de espera
- `/settings` - Configuración

Rutas protegidas con `ProtectedRoute.jsx`.

## Autenticación

- Login con email y contraseña
- Token JWT almacenado en localStorage
- Rutas protegidas con `ProtectedRoute`
- Logout que limpia el token

## Visualización de Mesas

Uso de React Konva para visualizar mesas en un canvas interactivo:
- Posicionamiento visual de mesas
- Estados visuales (disponible, ocupada, etc.)
- Interacción con mesas

## Performance

Ver [PERFORMANCE_GUIDE.md](PERFORMANCE_GUIDE.md) para optimizaciones y mejores prácticas.

## Variables de Entorno

```env
# URL de la API backend
VITE_API_URL=http://localhost:3000
```

## Troubleshooting

### Error: "Failed to fetch"

Verifica que:
1. El backend está corriendo
2. `VITE_API_URL` está configurada correctamente
3. No hay problemas de CORS

### Error: "Cannot find module"

```bash
npm install
```

### Build falla

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## Contribuir

Ver [README.md](../README.md) para guía de contribución.
