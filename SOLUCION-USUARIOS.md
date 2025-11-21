# 🚀 SnorxFit - Guía de Uso (Solución al Problema de Usuarios)

## 🔍 **PROBLEMA IDENTIFICADO:**
Cuando detienes la compilación del frontend, también se detiene el servidor backend, causando que:
- ❌ Los usuarios no se guarden en la base de datos MySQL
- ❌ La app funcione en modo offline (localStorage)
- ❌ No puedas iniciar sesión con usuarios registrados anteriormente

## ✅ **SOLUCIÓN:**

### **1. Usar el Script de Inicio Automático**
```bash
# Desde: c:\xampp\htdocs\FICTIA\
.\start-snorxfit.bat
```

**Esto iniciará:**
- ✅ **Backend** en puerto 5000 (ventana separada)
- ✅ **Frontend** en puerto 3000 (ventana separada)
- ✅ **Verificación** de base de datos automática

### **2. Para Detener Correctamente**
```bash
# Desde: c:\xampp\htdocs\FICTIA\
.\stop-snorxfit.bat
```

### **3. Verificar Estado de Conexión**
La app ahora muestra en la parte superior:
- 🟢 **Verde**: "Conectado a Base de Datos MySQL"
- 🟡 **Amarillo**: "Modo Offline - Datos en LocalStorage"

## 🎯 **CÓMO USAR CORRECTAMENTE:**

### **Inicio Diario:**
1. ✅ Abrir XAMPP y iniciar MySQL
2. ✅ Ejecutar `start-snorxfit.bat`
3. ✅ Verificar indicador verde en la web
4. ✅ Registrar/Login funcionará con MySQL

### **Al Terminar el Día:**
1. ✅ Ejecutar `stop-snorxfit.bat`
2. ✅ Cerrar XAMPP si deseas

### **Si Necesitas Reiniciar Solo Frontend:**
1. ❌ NO cierres con Ctrl+C
2. ✅ Usa `stop-snorxfit.bat` y luego `start-snorxfit.bat`
3. ✅ O deja el backend funcionando y solo reinicia frontend

## 🛠️ **DEPURACIÓN:**

### **Si aparece indicador amarillo:**
1. Verificar que XAMPP/MySQL esté funcionando
2. Verificar que el backend esté en puerto 5000
3. Ejecutar en consola del navegador: `testApiConnection()`

### **Si los usuarios no se guardan:**
- ✅ Debe aparecer indicador **verde**
- ✅ Backend debe estar funcionando en puerto 5000
- ✅ Base de datos `snorxfit_db` debe existir

## 🎉 **RESULTADO:**
- ✅ **Usuarios se guardan** en MySQL permanentemente
- ✅ **Login funciona** después de cerrar/abrir app
- ✅ **Datos persisten** entre sesiones
- ✅ **Servidores estables** independientes

**¡Ahora SnorxFit funcionará correctamente sin perder usuarios! 🎯😴**