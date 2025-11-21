# 🚀 Cómo Probar la Instalación PWA

## ✅ **La funcionalidad PWA está lista**

### 📱 **Probar en Móvil Real**

#### **Opción 1: Desplegar en servidor**
1. Subir carpeta `build/` a un servidor con HTTPS
2. Abrir desde el móvil
3. Esperar 5 segundos → aparecerá el prompt de instalación

#### **Opción 2: Usar ngrok (localhost público)**
```bash
# 1. Instalar ngrok: https://ngrok.com/download
# 2. Servir la carpeta build
npm install -g serve
serve -s build -p 3000

# 3. En otra terminal, exponer el puerto
ngrok http 3000

# 4. Copiar la URL https:// que te da ngrok
# 5. Abrir esa URL en tu móvil
```

#### **Opción 3: Usar GitHub Pages**
```bash
# 1. Instalar gh-pages
npm install --save-dev gh-pages

# 2. Agregar al package.json:
"homepage": "https://TUUSUARIO.github.io/snorxfit",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# 3. Desplegar
npm run deploy

# 4. Abrir la URL en el móvil
```

---

### 💻 **Probar en Chrome DevTools (Simulación)**

1. **Compilar la app:**
   ```bash
   npm run build
   ```

2. **Servir la carpeta build:**
   ```bash
   npx serve -s build
   ```

3. **Abrir en Chrome:**
   - Ir a `http://localhost:3000`
   - Abrir DevTools (F12)

4. **Activar modo móvil:**
   - Click en icono de móvil (arriba izquierda)
   - Seleccionar "iPhone 12 Pro" o similar

5. **Verificar PWA:**
   - Ir a pestaña **Application**
   - Sección **Manifest**: Verificar que aparezca
   - Sección **Service Workers**: Verificar que esté registrado
   - Verificar que NO esté en modo instalado

6. **Forzar prompt (si no aparece automáticamente):**
   - Abrir Console
   - Ejecutar:
   ```javascript
   localStorage.removeItem('pwa_install_dismissed');
   location.reload();
   ```

7. **Esperar 5 segundos:**
   - ✅ Debería aparecer el prompt flotante en la esquina inferior

---

### 🍎 **Probar en iOS (Safari)**

1. **Abrir desde Safari** (no Chrome)
2. **Esperar 5 segundos**
3. **Click en "Ver cómo"**
4. **Seguir las instrucciones del modal**
5. **Toca botón Compartir** ⎋ → **Añadir a pantalla de inicio**

---

### 🤖 **Probar en Android (Chrome)**

1. **Abrir desde Chrome** (navegador principal)
2. **Esperar 5 segundos**
3. **Aparecerá el prompt** "¡Instala SnorxFit!"
4. **Click en "Instalar"**
5. **Chrome mostrará diálogo nativo** → Instalar
6. ✅ **App instalada en pantalla de inicio**

---

## 🧪 **Testing Checklist**

### **Service Worker**
- [ ] Se registra correctamente (ver Console)
- [ ] Aparece en DevTools → Application → Service Workers
- [ ] Estado: "activated and running"
- [ ] Scope: "/" o el correcto

### **Manifest**
- [ ] Se carga sin errores
- [ ] Iconos se muestran correctamente
- [ ] Nombre: "SnorxFit"
- [ ] Display: "standalone"
- [ ] Theme color: "#3b82f6"

### **Prompt de Instalación**
- [ ] Aparece después de 5 segundos (móvil)
- [ ] NO aparece si ya está instalado
- [ ] Se puede descartar con X
- [ ] Al descartar, guarda en localStorage
- [ ] NO reaparece por 7 días tras descartar

### **iOS**
- [ ] Muestra instrucciones (no hay instalación automática)
- [ ] Modal con pasos claros
- [ ] Se puede cerrar
- [ ] Funciona desde Safari

### **Android**
- [ ] Muestra prompt nativo del navegador
- [ ] Se puede instalar con un toque
- [ ] Aparece icono en home
- [ ] Abre en modo fullscreen

### **Funcionalidad Instalada**
- [ ] Icono 😴 aparece en pantalla inicio
- [ ] Abre sin barra del navegador
- [ ] Funciona offline (cachea recursos)
- [ ] Loading es más rápido (segunda visita)

---

## 🐛 **Troubleshooting**

### **No aparece el prompt**
```javascript
// Limpiar localStorage
localStorage.removeItem('pwa_install_dismissed');
location.reload();

// Verificar que no esté instalado
console.log('Instalado:', window.matchMedia('(display-mode: standalone)').matches);

// Verificar service worker
navigator.serviceWorker.getRegistration().then(reg => console.log('SW:', reg));
```

### **Service Worker no se registra**
1. Verificar que existe `build/sw.js`
2. Abrir DevTools → Application → Service Workers
3. Click en "Unregister" si hay uno viejo
4. Recargar la página
5. Verificar Console por errores

### **Manifest no se carga**
1. Verificar que existe `build/manifest.json`
2. Abrir DevTools → Application → Manifest
3. Verificar que no haya errores JSON
4. Verificar que los iconos se puedan cargar

---

## 📊 **Comandos Útiles**

```bash
# Limpiar cache del navegador
# Chrome: Ctrl+Shift+Del → Limpiar todo

# Desregistrar service worker (Console)
navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));

# Limpiar localStorage PWA
localStorage.removeItem('pwa_install_dismissed');

# Verificar si está instalado
console.log(window.matchMedia('(display-mode: standalone)').matches);

# Forzar actualización de service worker
navigator.serviceWorker.getRegistration().then(reg => reg.update());
```

---

## 🎯 **Lo que Verás**

### **Desktop (Chrome):**
```
Barra de direcciones:
┌────────────────────────────────────┐
│ 🔒 localhost:3000   [⚙️ Instalar] │  ← Icono de instalación
└────────────────────────────────────┘
```

### **Móvil (Prompt Flotante):**
```
┌──────────────────────────────────────┐
│  😴  ¡Instala SnorxFit!             │
│                                      │
│  Agrega SnorxFit a tu pantalla      │
│  de inicio para acceso rápido       │
│                                      │
│  [ 📥 Instalar ]           [ ✕ ]    │
└──────────────────────────────────────┘
```

### **iOS (Modal con Instrucciones):**
```
┌──────────────────────────────────────┐
│  Cómo instalar en iOS 📱      [ ✕ ] │
├──────────────────────────────────────┤
│  ① Toca el botón "Compartir" ⎋      │
│  ② Selecciona "Añadir a inicio" ➕   │
│  ③ Toca "Añadir"                    │
└──────────────────────────────────────┘
```

---

## ✅ **Confirmación de Éxito**

Si ves esto, ¡está funcionando! ✨

1. **Console muestra:**
   ```
   🎉 Service Worker registrado exitosamente: /
   ```

2. **Application → Service Workers muestra:**
   ```
   Status: activated and running
   Scope: /
   ```

3. **Después de 5 segundos:**
   ```
   Aparece prompt flotante en esquina inferior 📱
   ```

4. **Al instalar:**
   ```
   Icono 😴 en pantalla de inicio
   App abre en fullscreen
   ```

---

🎉 **¡Listo para probar!**
