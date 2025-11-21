# 🔐 Sistema de Administración - SÚPER SIMPLE

## ✅ **Cómo Funciona**

1. Vas a Firebase Console
2. Creas un usuario con email: `admin@gmail.com` y password: `147258`
3. Inicias sesión con ese email en la app
4. Automáticamente ves el **Panel de Administrador** 🎉

---

## 📝 **Pasos Detallados:**

### **1️⃣ Crear Usuario Admin en Firebase:**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **FICTIA**
3. Ve a **Authentication** en el menú izquierdo
4. Haz clic en **"Users"** (o "Usuarios")
5. Haz clic en **"Add user"** (o "Agregar usuario")
6. Ingresa:
   - **Email:** `admin@gmail.com`
   - **Password:** `147258`
7. Haz clic en **"Add user"**

### **2️⃣ Iniciar Sesión como Admin:**

1. Abre la app: `http://localhost:3000`
2. En la pantalla de login, ingresa:
   - **Email:** `admin@gmail.com`
   - **Password:** `147258`
3. Haz clic en **"Iniciar Sesión"**
4. ¡Listo! Verás el **Panel de Administrador** 🎉

---

## 🎯 **Credenciales Admin:**

```
Email:    admin@gmail.com
Password: 147258
```

---

## ➕ **Agregar Más Admins:**

Si quieres que otro email también sea admin:

1. Abre el archivo: `src/config/adminConfig.js`
2. Agrega el email al array:

```javascript
export const ADMIN_EMAILS = [
  'admin@gmail.com',
  'otro_admin@ejemplo.com', // ← Agregar aquí
];
```

3. Crea ese usuario en Firebase Authentication
4. Listo, ese email también es admin

---

## 🔄 **Cambiar Contraseña Admin:**

1. Ve a Firebase Console → Authentication
2. Busca el usuario `admin@gmail.com`
3. Haz clic en los tres puntos ⋮
4. Selecciona **"Reset password"** o **"Change password"**
5. Ingresa la nueva contraseña

---

## 🎨 **¿Qué Ve el Admin?**

Al iniciar sesión con `admin@gmail.com` verás:

- 📊 **Panel General** - Estadísticas globales
- 👥 **Gestión de Usuarios** - Ver todos los usuarios
- 🤖 **Chatbot Analytics** - Estadísticas del chatbot
- 🆘 **Soporte** - Tickets y feedback
- ⚙️ **Configuraciones** - Parámetros del sistema

---

## ✨ **Eso es TODO**

No hay comandos complicados, no hay scripts, no hay Firebase Admin SDK.

Solo:
1. Creas el usuario en Firebase Console
2. Inicias sesión
3. Ves el panel admin

**¡Así de simple!** 🚀

---

**Hecho con ❤️ por SnorxFit**
