# Guía de Optimización de Rendimiento - React

## 🔍 Herramientas para Analizar Rendimiento

### 1. React DevTools Profiler (RECOMENDADO)
**Instalación:**
- Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
- Firefox: https://addons.mozilla.org/es/firefox/addon/react-devtools/

**Uso:**
1. Abre DevTools (F12)
2. Ve a la pestaña "Profiler"
3. Haz clic en el botón de grabar (círculo azul)
4. Interactúa con la app (scroll, clicks, etc.)
5. Detén la grabación
6. Revisa qué componentes se renderizaron y cuánto tiempo tardaron

**Qué buscar:**
- Componentes que se renderizan sin cambios (amarillo/naranja)
- Componentes que tardan > 16ms (rojo)
- Re-renders en cascada

### 2. Chrome DevTools Performance
**Uso:**
1. DevTools → pestaña "Performance"
2. Graba mientras usas la app
3. Busca:
   - **Frames**: Deben estar en 60fps (16.67ms por frame)
   - **Long tasks**: Tareas que duran > 50ms
   - **Layout shifts**: Cambios visuales inesperados

### 3. Lighthouse
**Uso:**
1. DevTools → pestaña "Lighthouse"
2. Selecciona "Performance"
3. Ejecuta análisis
4. Revisa:
   - **FCP** (First Contentful Paint): < 1.8s
   - **LCP** (Largest Contentful Paint): < 2.5s
   - **TTI** (Time to Interactive): < 3.8s

### 4. React.StrictMode
Ya está activo en desarrollo y detecta problemas automáticamente.

## 🚀 Optimizaciones Aplicadas en el Código

### ✅ 1. React.memo() - Componente ReservaCard
- Extraído el componente de tarjeta individual
- Evita re-renders cuando otras reservas cambian
- Solo se re-renderiza si sus props cambian

### ✅ 2. useMemo() - Cálculos Costosos
- `ReservasMetricas`: Cálculo de métricas memoizado
- `ReservasFiltroBar`: Array de estados memoizado
- Evita recalcular en cada render

### ✅ 3. useCallback() - Funciones Estables
- `handleBuscar`, `handleLimpiar`: Funciones memoizadas
- `handleCambiarEstado`, `handleDeleteReserva`, `handleSave`: Handlers memoizados
- Evita recrear funciones en cada render

### ✅ 4. Componentes Extraídos
- `ReservaCard`: Componente separado y optimizado
- Reduce complejidad del componente principal

## 📊 Métricas a Monitorear

### En React DevTools Profiler:
- **Render time**: < 16ms por componente
- **Commit time**: < 50ms total
- **Re-renders**: Solo cuando cambian props/state

### En Chrome Performance:
- **FPS**: Mantener 60fps constante
- **JS Heap**: No debe crecer indefinidamente (memory leak)
- **Network**: Requests optimizados

## 🎯 Checklist de Optimización

- [x] Usar React.memo en componentes que reciben props
- [x] Usar useMemo para cálculos costosos
- [x] Usar useCallback para funciones pasadas como props
- [x] Evitar crear objetos/funciones en el render
- [ ] Lazy loading de componentes pesados (futuro)
- [ ] Code splitting con React.lazy() (futuro)
- [ ] Optimizar imágenes y assets (si aplica)

## 🔧 Optimizaciones Adicionales Recomendadas

### 1. Virtualización de Listas (si hay muchas reservas)
```javascript
// Si tienes > 50 reservas, considera usar react-window
import { FixedSizeList } from 'react-window';
```

### 2. Debounce en Búsquedas
```javascript
// Para el input de nombre, agregar debounce
import { useDebouncedCallback } from 'use-debounce';
```

### 3. Lazy Loading de Modales
```javascript
const EditarReservaModal = React.lazy(() => import('./EditarReservaModal'));
```

## 📈 Cómo Medir Mejoras

1. **Antes de optimizar:**
   - Graba con Profiler
   - Anota tiempo de render promedio
   - Cuenta re-renders innecesarios

2. **Después de optimizar:**
   - Compara tiempos
   - Verifica reducción de re-renders
   - Mide FPS durante scroll

## ⚠️ Problemas Comunes

1. **Re-renders en cascada**: Un componente cambia → todos los hijos se re-renderizan
   - **Solución**: React.memo() en componentes hijos

2. **Funciones recreadas**: Cada render crea nuevas funciones
   - **Solución**: useCallback()

3. **Cálculos repetidos**: Mismo cálculo en cada render
   - **Solución**: useMemo()

4. **Polling muy frecuente**: Requests cada 3 segundos
   - **Solución actual**: Ya optimizado con AbortController y visibility API

## 🎯 Optimizaciones de Core Web Vitals

### LCP (Largest Contentful Paint) - Objetivo: < 2.5s

**Problema**: El elemento más grande tarda mucho en aparecer.

**Optimizaciones aplicadas**:
- ✅ Preload de fuentes en `index.html` para evitar bloqueo de renderizado
- ✅ Skeleton loading para mantener el layout estable
- ✅ Contenido crítico renderizado inmediatamente (título, descripción)
- ✅ `content-visibility: auto` en elementos no críticos

**Cómo medir**:
- Lighthouse → Performance → LCP
- Chrome DevTools → Performance → Grabar → Buscar "LCP" en la timeline

### CLS (Cumulative Layout Shift) - Objetivo: < 0.1

**Problema**: Elementos que se mueven después de cargar, causando saltos visuales.

**Optimizaciones aplicadas**:
- ✅ Dimensiones fijas (`width`, `height`) en imágenes (`Login.jsx`)
- ✅ `min-height` y `min-width` en métricas para evitar cambios de tamaño
- ✅ `tabular-nums` para números con ancho consistente
- ✅ Skeleton loading con dimensiones exactas
- ✅ Fuentes con `font-display: swap` para evitar FOIT (Flash of Invisible Text)

**Cómo medir**:
- Lighthouse → Performance → CLS
- Chrome DevTools → Performance → Grabar → Buscar "Layout Shift" en la timeline

### FCP (First Contentful Paint) - Objetivo: < 1.8s

**Optimizaciones aplicadas**:
- ✅ Preload de fuentes críticas
- ✅ Contenido crítico renderizado antes de datos
- ✅ Skeleton loading para feedback inmediato

## 📋 Checklist de Optimización LCP/CLS

- [x] Preload de fuentes críticas
- [x] Width/height en todas las imágenes
- [x] Skeleton loading con dimensiones fijas
- [x] Min-height/min-width en elementos dinámicos
- [x] Font-display: swap
- [x] Contenido crítico renderizado primero
- [x] Lazy loading de rutas con React.lazy()
- [x] Code splitting configurado en Vite
- [ ] Lazy loading de imágenes fuera del viewport (si aplica)
- [x] Preconnect a dominios externos (Google Fonts)

## 🚀 Optimizaciones de Build y Code Splitting

### Lazy Loading de Rutas

**Implementado**: Todas las páginas ahora se cargan bajo demanda usando `React.lazy()` y `Suspense`.

**Beneficios**:
- ✅ Reducción del bundle inicial (~982 KiB según Lighthouse)
- ✅ Carga más rápida de la página principal
- ✅ Mejor experiencia de usuario (carga progresiva)

**Cómo funciona**:
```javascript
// Antes: Todo se carga al inicio
import Home from "./pages/Home";

// Después: Se carga solo cuando se necesita
const Home = lazy(() => import("./pages/Home"));
```

### Configuración de Vite Optimizada

**Cambios aplicados**:
- ✅ Code splitting manual de vendors (react, lucide-react)
- ✅ Minificación con esbuild (más rápido que terser)
- ✅ CSS code splitting activado
- ✅ Optimización de nombres de chunks con hash
- ✅ Pre-bundling de dependencias comunes

**Resultados esperados en producción**:
- Bundle inicial reducido en ~40-50%
- Tiempo de carga inicial reducido significativamente
- Mejor caché (chunks con hash)

## ⚠️ Importante: Desarrollo vs Producción

**Los tiempos reportados (FCP: 11.8s, LCP: 21.5s) son NORMALES en desarrollo** porque:

1. **No hay minificación**: El código está sin comprimir
2. **Source maps activos**: Aumentan el tamaño del bundle
3. **Sin compresión**: No hay gzip/brotli
4. **Hot Module Replacement**: Vite inyecta código adicional
5. **Modo desarrollo de React**: Incluye warnings y validaciones

**Para medir el rendimiento real**:
```bash
# 1. Build de producción
npm run build

# 2. Preview del build
npm run preview

# 3. Ejecutar Lighthouse en localhost:4173
```

**Resultados esperados en producción**:
- FCP: < 1.5s
- LCP: < 2.5s
- TBT: < 200ms
- CLS: < 0.1
- Bundle inicial: ~200-300 KiB (vs 3354 KiB en desarrollo)

## 🔧 Optimizaciones Adicionales Recomendadas

### 1. Compresión del Servidor
Configurar gzip/brotli en el servidor de producción:
```nginx
# Nginx example
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 2. CDN para Assets Estáticos
Servir fuentes, imágenes y assets desde un CDN.

### 3. Service Worker (PWA)
Implementar service worker para cacheo offline y mejor rendimiento.

### 4. Preload de Rutas Críticas
Pre-cargar rutas más visitadas:
```javascript
// Preload de rutas críticas
import('./pages/Home').then(module => {
  // Pre-cargado
});
```

## 📊 Métricas de Rendimiento

### En Desarrollo (Actual)
- FCP: ~11.8s ⚠️ (Normal para desarrollo)
- LCP: ~21.5s ⚠️ (Normal para desarrollo)
- TBT: 70ms ✅
- CLS: 0.003 ✅

### En Producción (Esperado)
- FCP: < 1.5s ✅
- LCP: < 2.5s ✅
- TBT: < 200ms ✅
- CLS: < 0.1 ✅

## 🎯 Próximos Pasos

1. **Ejecutar build de producción** y medir con Lighthouse
2. **Configurar compresión** en el servidor
3. **Implementar Service Worker** para PWA
4. **Optimizar imágenes** (WebP, lazy loading)
5. **Monitorear en producción** con herramientas como Web Vitals

