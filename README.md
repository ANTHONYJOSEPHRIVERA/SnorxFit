# SnorxFit (Preview)

Aplicación fitness con seguimiento de peso, estados de ánimo, recordatorios, galería de fotos, análisis de comida con IA (Gemini) y modo offline básico.

## Características Principales
- Autenticación JWT (stateless).
- Perfil con datos antropométricos y cálculo de IMC.
- Peso: historial + gráfico SVG (últimos 14 registros) + export CSV.
- Estados de ánimo (diario emocional) con notas.
- Recordatorios configurables (agua, comida, entrenamiento, dormir).
- Galería de fotos (progreso / comidas) con validación de formato y tamaño.
- Escáner de comida (IA Gemini) para estimar macros y calorías.
- Cola offline (peso, ánimo, recordatorios) y sincronización al volver online.
- Tema claro/oscuro persistente.
- Sistema de notificaciones (toasts) centralizado.

## Requerimientos
- Node.js 18+
- MySQL activo (XAMPP u otro).
- Variables .env en backend:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=snorxfit
JWT_SECRET=super_secreto
GEMINI_KEY=AIza... (clave válida de Google Generative AI)
CORS_ORIGIN=http://localhost:3000
```

## Instalación
Backend:
```
cd backend
npm install
npm run dev
```
Frontend:
```
npm install
npm start
```

## Endpoints Clave
| Recurso | Método | Ruta | Descripción |
|---------|--------|------|-------------|
| Auth | POST | /api/auth/login | Login |
| Perfil | GET | /api/profiles/me | Obtener perfil |
| Peso | GET/POST | /api/weights | Listar / crear registro |
| Ánimos | GET/POST | /api/moods | Diario emocional |
| Recordatorios | GET/POST/PUT/DELETE | /api/reminders | CRUD |
| Fotos | GET/POST/DELETE | /api/photos | Galería |
| IA Comida | POST | /api/ai/food/analyze | Análisis imagen |

## Flujo RecomENDADO (Smoke Test)
1. Registro/Login.
2. Crear perfil inicial.
3. Seleccionar alimentos (opcional) y pasar al dashboard.
4. Registrar 1–2 pesos.
5. Subir una foto de progreso (<2MB, png/jpg/webp).
6. Escanear una foto de comida (necesita GEMINI_KEY válida).
7. Registrar un estado de ánimo.
8. Crear un recordatorio (agua) y activarlo.
9. Poner modo offline (apagar servidor) → registrar otro peso / ánimo / recordatorio → volver online y verificar sincronización.

## Cola Offline
Operaciones soportadas: weight:add, mood:add, reminder:add. Se almacenan en localStorage y se intentan enviar al recuperar conectividad.

## Seguridad & Limitaciones
- Fotos: límite 2MB y tipos jpeg/png/webp.
- Falta sanitización profunda de inputs (no permitir HTML en notas/captions en backend todavía).
- No hay paginación (riesgo de cargas grandes en listados).
- Sin tests automatizados aún.

## Próximos Pasos Sugeridos
- Añadir paginación y filtros.
- Sincronización bidireccional avanzada (resolución de conflictos).
- Tests unitarios e integración.
- Sanitizar y validar en backend (xss, length caps).
- Notificaciones push (Service Worker).

## Licencia
MIT
