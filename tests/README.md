# Pruebas Selenium para BiteWise

Este directorio contiene las pruebas automatizadas con Selenium WebDriver para la aplicación BiteWise.

## 📁 Estructura de Archivos

### Configuración Base
- `selenium-config.ts` - Clase base con utilidades para Selenium

### Pruebas Funcionales
- `basic-navigation.test.ts` - Pruebas básicas de navegación
- `auth-flow.test.ts` - Pruebas completas de flujo de autenticación
- `navigation-menu.test.ts` - Pruebas de navegación y menús
- `form-interaction.test.ts` - Pruebas de interacción con formularios
- `user-interactions.test.ts` - Pruebas de interacciones avanzadas del usuario

### Pruebas de Calidad
- `responsive-design.test.ts` - Pruebas de diseño responsivo
- `performance-accessibility.test.ts` - Pruebas de rendimiento y accesibilidad
- `error-handling.test.ts` - Pruebas de manejo de errores y casos límite

## 🚀 Ejecutar Pruebas

### Ejecutar todas las pruebas Selenium:
```bash
npm run test:selenium
```

### Ejecutar pruebas en modo watch:
```bash
npm run test:selenium:watch
```

### Ejecutar con salida detallada:
```bash
npm run test:selenium:verbose
```

### Ejecutar una prueba específica:
```bash
npm test -- auth-flow.test.ts
npm test -- responsive-design.test.ts
```

## 📋 Cobertura de Pruebas

### ✅ Funcionalidades Cubiertas

**Autenticación:**
- Navegación login/registro
- Validación de formularios
- Recuperación de contraseña
- Redirecciones de autenticación

**Navegación:**
- Menú principal y navegación por secciones
- Navegación móvil responsiva
- Redirecciones y enlaces internos
- Acceso a páginas protegidas

**Interacciones:**
- Formularios de contacto/registro
- Botones y elementos interactivos
- Hover effects y tooltips
- Scroll y lazy loading
- Modales y popups
- Cambio de temas (dark/light)

**Diseño Responsivo:**
- Desktop (1920x1080)
- Tablet (768x1024)
- Móvil (375x667)
- Orientación horizontal

**Rendimiento:**
- Tiempos de carga
- Uso de memoria
- Número de elementos DOM
- Optimización de recursos

**Accesibilidad:**
- Estructura semántica HTML5
- Navegación por teclado
- Atributos ARIA
- Contraste y legibilidad
- Imágenes con alt text

**Manejo de Errores:**
- Páginas 404
- Redirecciones incorrectas
- Validación de formularios
- Caractereres especiales y XSS
- Sesiones expiradas

## ⚙️ Configuración

Las pruebas están configuradas para ejecutarse en modo headless por defecto. Para ejecutarlas con navegador visible, cambia el parámetro en `beforeAll`:

```typescript
await seleniumConfig.createDriver(false); // false para modo visible
```

## 🔧 Prerrequisitos

1. **Aplicación corriendo**: Asegúrate de tener la aplicación corriendo en `http://localhost:3000`
   ```bash
   npm run dev
   ```

2. **Chrome browser**: Debe tener Chrome instalado

3. **Dependencias instaladas**:
   ```bash
   npm install
   ```

## 🐛 Troubleshooting

### Errores Comunes

**"Cannot find module 'selenium-webdriver'"**:
```bash
npm install selenium-webdriver @types/selenium-webdriver
```

**"ChromeDriver not found"**:
```bash
npm install chromedriver
```

**Conexión rechazada**:
- Asegúrate que la aplicación esté corriendo en el puerto 3000
- Verifica que no haya otro proceso usando el puerto

**Timeout errors**:
- Aumenta el timeout en las pruebas individuales
- Verifica la velocidad de tu conexión

### Tips para Debugging

1. **Modo visible**: Cambia `createDriver(true)` a `createDriver(false)` para ver el navegador

2. **Screenshots**: Añade esta línea para capturar pantalla:
   ```typescript
   const screenshot = await driver.takeScreenshot();
   console.log('Screenshot taken');
   ```

3. **Logs detallados**: Usa `console.log` extensivamente en las pruebas

4. **Ejecución individual**: Prueba una prueba a la vez para aislar problemas

## 📈 Métricas Importantes

Las pruebas verifican:
- Tiempos de carga < 10 segundos
- Menos de 2000 nodos DOM
- Menos de 50 imágenes por página
- Uso de memoria < 100MB
- Al menos 80% de imágenes con alt text
- Al menos 70% de enlaces descriptivos

## 🔄 Flujo de Pruebas Recomendado

1. **Pruebas básicas**: `basic-navigation.test.ts`
2. **Autenticación**: `auth-flow.test.ts`
3. **Navegación**: `navigation-menu.test.ts`
4. **Responsivo**: `responsive-design.test.ts`
5. **Interacciones**: `user-interactions.test.ts`
6. **Rendimiento**: `performance-accessibility.test.ts`
7. **Errores**: `error-handling.test.ts`

## 📝 Notas Adicionales

- Las pruebas tienen un timeout de 30 segundos por defecto
- ChromeDriver se descarga automáticamente con la instalación
- Las pruebas incluyen esperas explícitas para asegurar carga completa
- Algunas pruebas asumen que la aplicación está en español
- Las pruebas están diseñadas para ser no destructivas
