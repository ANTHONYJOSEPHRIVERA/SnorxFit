# 🚀 Guía de Configuración - SnorxFit con MySQL

## 📋 Pasos para Configurar la Base de Datos

### 1. 🔧 Iniciar XAMPP
1. Abre **XAMPP Control Panel**
2. Inicia **Apache** y **MySQL**
3. Verifica que ambos servicios estén en verde

### 2. 🗄️ Crear la Base de Datos
1. Abre tu navegador y ve a: http://localhost/phpmyadmin
2. Haz clic en **"Nueva"** en el panel izquierdo
3. Nombra la base de datos: `SnorxFit_db`
4. Selecciona codificación: `utf8mb4_unicode_ci`
5. Haz clic en **"Crear"**

### 3. 📊 Importar la Estructura
1. Selecciona la base de datos `SnorxFit_db`
2. Ve a la pestaña **"Importar"**
3. Haz clic en **"Elegir archivo"**
4. Selecciona: `c:\xampp\htdocs\SnorxFit\database\setup.sql`
5. Haz clic en **"Continuar"**

### 4. ✅ Verificar la Instalación
Deberías ver las siguientes tablas creadas:
- `users` - Usuarios registrados
- `user_profiles` - Perfiles de fitness
- `weight_tracking` - Seguimiento de peso
- `workout_tracking` - Seguimiento de ejercicios
- `user_foods` - Comidas seleccionadas
- `user_sessions` - Sesiones de usuario

## 🎯 Comandos Rápidos

### Opción A: Usando phpMyAdmin (Recomendado)
1. Ve a http://localhost/phpmyadmin
2. Ejecuta el contenido de `database/setup.sql`

### Opción B: Usando línea de comandos
```bash
# Desde el directorio SnorxFit
mysql -u root -p < database/setup.sql
```

### Opción C: Usando el script npm
```bash
# Desde el directorio backend
npm run setup-db
```

## 🔍 Verificar que Todo Funciona

### 1. Probar Backend
```bash
cd backend
npm start
```

Deberías ver:
```
🚀 ===== SnorxFit BACKEND SERVIDOR =====
🌟 Servidor ejecutándose en puerto 5000
🐻 Snorlax se conectó exitosamente a MySQL!
😴 Snorlax está listo para la acción!
```

### 2. Probar Endpoints
- Health Check: http://localhost:5000/api/health
- API Info: http://localhost:5000/

## 🚨 Solución de Problemas

### Error: "Cannot connect to MySQL"
1. ✅ Verifica que XAMPP esté ejecutándose
2. ✅ Verifica que MySQL esté activo (verde en XAMPP)
3. ✅ Verifica que la base de datos `SnorxFit_db` exista
4. ✅ Verifica las credenciales en `.env`

### Error: "Database SnorxFit_db doesn't exist"
1. Crea la base de datos manualmente en phpMyAdmin
2. Ejecuta el script `database/setup.sql`

### Error: "Access denied for user 'root'"
1. Verifica la contraseña en `.env` (por defecto está vacía)
2. Si tienes contraseña, actualiza `DB_PASSWORD` en `.env`

## 📱 Próximo Paso: Actualizar Frontend

Una vez que el backend esté funcionando, actualiza el frontend para usar la API en lugar de localStorage.

---

*¡Snorlax está emocionado de trabajar con MySQL! 😴💾*
