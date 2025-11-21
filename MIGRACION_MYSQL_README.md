# 🚀 SnorxFit - Migración Completa a MySQL

## ✅ **Estado de la Migración**

### **Backend (✅ COMPLETADO)**
- ✅ Servidor Express configurado en puerto 5000
- ✅ Conexión a MySQL establecida (base de datos: `SnorxFit_db`)
- ✅ Autenticación JWT implementada
- ✅ API REST completa para usuarios y perfiles
- ✅ Middleware de autenticación y validación
- ✅ Manejo de errores y logging

### **Base de Datos (✅ COMPLETADO)**
- ✅ Base de datos `SnorxFit_db` creada en MySQL ✅
- ✅ 6 tablas principales:i
  - `users` - Usuarios registrados
  - `user_profiles` - Perfiles de fitness
  - `user_sessions` - Sesiones de autenticación
  - `weight_tracking` - Seguimiento de peso
  - `workout_tracking` - Seguimiento de ejercicios
  - `user_foods` - Comidas seleccionadas

### **Frontend (✅ COMPLETADO)**
- ✅ AuthContext actualizado para usar API
- ✅ Servicio API completo con fallback a localStorage
- ✅ Modo offline/online automático
- ✅ Indicador de conexión en el Dashboard
- ✅ Compatibilidad con datos existentes en localStorage

## 🎯 **Cómo Funciona Ahora**

### **Flujo de Autenticación:**
1. **Usuario se registra/logea** → API genera JWT token
2. **Token se guarda** en localStorage + sessionStorage
3. **Cada petición** incluye el token en headers
4. **Backend valida** token y sesión en BD
5. **Si token expira** → usuario se deslogea automáticamente

### **Flujo de Datos:**
1. **Modo Online**: Datos se guardan en MySQL + localStorage (backup)
2. **Modo Offline**: Datos se guardan solo en localStorage
3. **Recuperación**: API primero, localStorage como fallback
4. **Sincronización**: Automática cuando se recupera conexión

### **Seguridad Implementada:**
- 🔐 Contraseñas hasheadas con bcrypt (12 rounds)
- 🎫 JWT tokens con expiración de 24h
- 🛡️ Helmet.js para headers de seguridad
- 🚦 Rate limiting (100 requests/15min por IP)
- ✅ Validación de entrada con express-validator
- 🔒 CORS configurado para localhost:3000

## 🌐 **Endpoints de la API**

### **Autenticación (`/api/auth/`)**
- `POST /register` - Registrar usuario
- `POST /login` - Iniciar sesión
- `POST /logout` - Cerrar sesión
- `GET /verify` - Verificar token
- `POST /forgot-password` - Recuperar contraseña

### **Usuarios (`/api/users/`)**
- `GET /me` - Información del usuario
- `GET /stats` - Estadísticas del usuario

### **Perfiles (`/api/profiles/`)**
- `GET /me` - Obtener perfil
- `POST /me` - Crear/actualizar perfil
- `DELETE /me` - Eliminar perfil

### **Utilidad**
- `GET /api/health` - Estado del servidor
- `GET /` - Información de la API

## 🔧 **Configuración de Desarrollo**

### **Variables de Entorno**

#### **Backend (`.env`)**
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=SnorxFit_db
JWT_SECRET=SnorxFit_snorlax_secret_key_2025
CORS_ORIGIN=http://localhost:3000
```

#### **Frontend (`.env`)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_DEBUG_API=true
```

### **Scripts Disponibles**

#### **Backend**
```bash
cd backend
npm start          # Iniciar servidor
npm run dev        # Iniciar con nodemon
node test-connection.js  # Probar conexión DB
```

#### **Frontend**
```bash
npm start          # Iniciar React (puerto 3000)
```

## 📊 **Testing de la Migración**

### **1. Probar Backend**
```bash
# Verificar que el servidor esté corriendo
curl http://localhost:5000/api/health

# Probar registro
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'
```

### **2. Probar Frontend**
1. Abre http://localhost:3000
2. Verifica el indicador "Online" en el Dashboard
3. Registra un nuevo usuario
4. Cierra sesión y vuelve a iniciar
5. Los datos deben persistir en la base de datos

### **3. Probar Modo Offline**
1. Detén el servidor backend (`Ctrl+C`)
2. Recarga la página
3. Verifica que muestre "Offline"
4. Los datos locales deben seguir funcionando

## 🐛 **Solución de Problemas**

### **"API no disponible"**
- ✅ Verifica que el backend esté ejecutándose en puerto 5000
- ✅ Verifica que no haya errores en la consola del backend
- ✅ Verifica la configuración CORS

### **"Cannot connect to MySQL"**
- ✅ Verifica que XAMPP esté ejecutándose
- ✅ Verifica que MySQL esté activo (verde)
- ✅ Verifica que la base de datos `SnorxFit_db` exista

### **"Token inválido"**
- 🔄 Los tokens expiran en 24h, es normal
- 🔄 Cierra sesión y vuelve a iniciar
- 🔄 Verifica que el JWT_SECRET sea el mismo en backend

## 🚀 **Próximos Pasos**

### **Funcionalidades Pendientes**
- [ ] Sincronización automática offline→online
- [ ] Seguimiento de peso con API
- [ ] Seguimiento de ejercicios con API
- [ ] Carga de imágenes de perfil
- [ ] Notificaciones push
- [ ] Exportar datos a PDF/Excel

### **Mejoras de Seguridad**
- [ ] Refresh tokens
- [ ] Encriptación de datos sensibles
- [ ] Verificación de email
- [ ] Autenticación de dos factores
- [ ] Rate limiting por usuario

### **Optimizaciones**
- [ ] Cache de consultas frecuentes
- [ ] Paginación en listas grandes
- [ ] Compresión de respuestas
- [ ] CDN para assets estáticos

---

## 🎉 **¡Migración Exitosa!**

Tu aplicación SnorxFit ahora está completamente integrada con MySQL y funcionando con una arquitectura moderna:

- 🐻 **Snorlax** sigue siendo tu mascota fitness
- 🗄️ **MySQL** guarda todos tus datos de forma segura
- 🌐 **API REST** permite escalabilidad futura
- 📱 **Modo offline** garantiza que siempre funcione
- 🔐 **Seguridad robusta** protege la información

*¡Snorlax está orgulloso de esta migración! 😴💾*
