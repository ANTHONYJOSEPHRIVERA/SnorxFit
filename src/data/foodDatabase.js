// Base de datos completa de alimentos con información nutricional
// Formato: { nombre, calorias, proteinas (g), carbohidratos (g), grasas (g), categoria }

export const ALIMENTOS_DB = [
  // ========== DESAYUNOS ==========
  // Cereales y avenas
  { nombre: 'Cereal con leche', calorias: 250, proteinas: 8, carbohidratos: 45, grasas: 4, categoria: 'desayuno' },
  { nombre: 'Avena Quaker con leche', calorias: 220, proteinas: 10, carbohidratos: 38, grasas: 5, categoria: 'desayuno' },
  { nombre: 'Avena con frutas', calorias: 200, proteinas: 7, carbohidratos: 35, grasas: 4, categoria: 'desayuno' },
  { nombre: 'Granola con yogurt', calorias: 280, proteinas: 12, carbohidratos: 42, grasas: 8, categoria: 'desayuno' },
  { nombre: 'Corn Flakes', calorias: 240, proteinas: 6, carbohidratos: 50, grasas: 2, categoria: 'desayuno' },
  { nombre: 'Zucaritas', calorias: 260, proteinas: 5, carbohidratos: 55, grasas: 2, categoria: 'desayuno' },
  
  // Bebidas calientes
  { nombre: 'Quinua con leche', calorias: 180, proteinas: 7, carbohidratos: 28, grasas: 4, categoria: 'desayuno' },
  { nombre: 'Maca con leche', calorias: 190, proteinas: 8, carbohidratos: 30, grasas: 4, categoria: 'desayuno' },
  { nombre: '7 Semillas con leche', calorias: 200, proteinas: 9, carbohidratos: 32, grasas: 5, categoria: 'desayuno' },
  { nombre: 'Emoliente', calorias: 120, proteinas: 1, carbohidratos: 28, grasas: 0, categoria: 'desayuno' },
  { nombre: 'Café con leche', calorias: 80, proteinas: 4, carbohidratos: 10, grasas: 3, categoria: 'desayuno' },
  { nombre: 'Café negro', calorias: 5, proteinas: 0, carbohidratos: 1, grasas: 0, categoria: 'desayuno' },
  { nombre: 'Té con leche', calorias: 70, proteinas: 3, carbohidratos: 9, grasas: 2, categoria: 'desayuno' },
  { nombre: 'Chocolate caliente', calorias: 150, proteinas: 6, carbohidratos: 24, grasas: 4, categoria: 'desayuno' },
  
  // Huevos
  { nombre: 'Huevos revueltos (2 unidades)', calorias: 180, proteinas: 14, carbohidratos: 2, grasas: 12, categoria: 'desayuno' },
  { nombre: 'Huevo frito (1 unidad)', calorias: 120, proteinas: 7, carbohidratos: 1, grasas: 9, categoria: 'desayuno' },
  { nombre: 'Huevo sancochado (1 unidad)', calorias: 80, proteinas: 6, carbohidratos: 1, grasas: 5, categoria: 'desayuno' },
  { nombre: 'Tortilla de huevo', calorias: 200, proteinas: 15, carbohidratos: 3, grasas: 14, categoria: 'desayuno' },
  
  // Panes y tostadas
  { nombre: 'Pan con mantequilla', calorias: 150, proteinas: 4, carbohidratos: 22, grasas: 6, categoria: 'desayuno' },
  { nombre: 'Pan con mermelada', calorias: 160, proteinas: 4, carbohidratos: 32, grasas: 2, categoria: 'desayuno' },
  { nombre: 'Pan con palta', calorias: 180, proteinas: 5, carbohidratos: 24, grasas: 8, categoria: 'desayuno' },
  { nombre: 'Pan con huevo', calorias: 220, proteinas: 11, carbohidratos: 25, grasas: 10, categoria: 'desayuno' },
  { nombre: 'Pan con hotdog', calorias: 280, proteinas: 12, carbohidratos: 28, grasas: 14, categoria: 'desayuno' },
  { nombre: 'Pan con chicharrón', calorias: 350, proteinas: 18, carbohidratos: 30, grasas: 20, categoria: 'desayuno' },
  { nombre: 'Tostadas con mantequilla (2 unidades)', calorias: 180, proteinas: 5, carbohidratos: 26, grasas: 7, categoria: 'desayuno' },
  { nombre: 'Pancakes (3 unidades)', calorias: 350, proteinas: 8, carbohidratos: 55, grasas: 12, categoria: 'desayuno' },
  
  // Otros desayunos
  { nombre: 'Yogurt con granola', calorias: 220, proteinas: 11, carbohidratos: 38, grasas: 5, categoria: 'desayuno' },
  { nombre: 'Yogurt natural', calorias: 120, proteinas: 9, carbohidratos: 15, grasas: 3, categoria: 'desayuno' },
  { nombre: 'Tamales (1 unidad)', calorias: 280, proteinas: 8, carbohidratos: 42, grasas: 10, categoria: 'desayuno' },
  { nombre: 'Empanada de queso', calorias: 250, proteinas: 10, carbohidratos: 28, grasas: 12, categoria: 'desayuno' },
  { nombre: 'Humitas (1 unidad)', calorias: 180, proteinas: 5, carbohidratos: 30, grasas: 6, categoria: 'desayuno' },
  
  // Fiambres y embutidos (para lonchera)
  { nombre: 'Pan con jamonada Gloria', calorias: 200, proteinas: 8, carbohidratos: 26, grasas: 7, categoria: 'desayuno' },
  { nombre: 'Pan con mortadela', calorias: 220, proteinas: 7, carbohidratos: 26, grasas: 10, categoria: 'desayuno' },
  { nombre: 'Pan con queso', calorias: 190, proteinas: 9, carbohidratos: 24, grasas: 7, categoria: 'desayuno' },
  { nombre: 'Pan con pollo deshilachado', calorias: 210, proteinas: 15, carbohidratos: 24, grasas: 6, categoria: 'desayuno' },
  { nombre: 'Pan con atún', calorias: 230, proteinas: 16, carbohidratos: 24, grasas: 8, categoria: 'desayuno' },
  { nombre: 'Pan con jamón del país', calorias: 240, proteinas: 12, carbohidratos: 26, grasas: 9, categoria: 'desayuno' },
  { nombre: 'Pan con salchicha', calorias: 270, proteinas: 10, carbohidratos: 28, grasas: 13, categoria: 'desayuno' },
  { nombre: 'Pan con paté', calorias: 200, proteinas: 6, carbohidratos: 24, grasas: 9, categoria: 'desayuno' },
  { nombre: 'Pan con chancho al cilindro', calorias: 350, proteinas: 20, carbohidratos: 30, grasas: 18, categoria: 'desayuno' },
  
  // ========== ALMUERZOS ==========
  // Arroz con proteína
  { nombre: 'Arroz con pollo a la plancha', calorias: 450, proteinas: 35, carbohidratos: 55, grasas: 10, categoria: 'almuerzo' },
  { nombre: 'Arroz con carne de res', calorias: 520, proteinas: 38, carbohidratos: 55, grasas: 16, categoria: 'almuerzo' },
  { nombre: 'Arroz con pescado frito', calorias: 480, proteinas: 32, carbohidratos: 55, grasas: 14, categoria: 'almuerzo' },
  { nombre: 'Arroz chaufa de pollo', calorias: 550, proteinas: 28, carbohidratos: 65, grasas: 18, categoria: 'almuerzo' },
  { nombre: 'Arroz chaufa de carne', calorias: 580, proteinas: 30, carbohidratos: 65, grasas: 20, categoria: 'almuerzo' },
  { nombre: 'Arroz con lomo saltado', calorias: 650, proteinas: 35, carbohidratos: 70, grasas: 22, categoria: 'almuerzo' },
  { nombre: 'Arroz con ají de gallina', calorias: 500, proteinas: 28, carbohidratos: 58, grasas: 18, categoria: 'almuerzo' },
  
  // Pastas
  { nombre: 'Pasta con salsa roja', calorias: 400, proteinas: 12, carbohidratos: 75, grasas: 6, categoria: 'almuerzo' },
  { nombre: 'Pasta con salsa blanca', calorias: 480, proteinas: 15, carbohidratos: 72, grasas: 14, categoria: 'almuerzo' },
  { nombre: 'Pasta carbonara', calorias: 550, proteinas: 22, carbohidratos: 70, grasas: 20, categoria: 'almuerzo' },
  { nombre: 'Pasta boloñesa', calorias: 520, proteinas: 25, carbohidratos: 68, grasas: 16, categoria: 'almuerzo' },
  { nombre: 'Tallarín saltado', calorias: 580, proteinas: 28, carbohidratos: 70, grasas: 20, categoria: 'almuerzo' },
  { nombre: 'Tallarín verde', calorias: 620, proteinas: 22, carbohidratos: 68, grasas: 28, categoria: 'almuerzo' },
  { nombre: 'Tallarín rojo', calorias: 550, proteinas: 20, carbohidratos: 72, grasas: 18, categoria: 'almuerzo' },
  
  // Comida peruana - PLATOS DE FONDO
  { nombre: 'Ceviche', calorias: 300, proteinas: 35, carbohidratos: 20, grasas: 8, categoria: 'almuerzo' },
  { nombre: 'Lomo saltado', calorias: 650, proteinas: 35, carbohidratos: 65, grasas: 25, categoria: 'almuerzo' },
  { nombre: 'Ají de gallina', calorias: 600, proteinas: 28, carbohidratos: 40, grasas: 35, categoria: 'almuerzo' },
  { nombre: 'Causa rellena', calorias: 320, proteinas: 12, carbohidratos: 45, grasas: 10, categoria: 'almuerzo' },
  { nombre: 'Papa a la huancaína', calorias: 280, proteinas: 8, carbohidratos: 35, grasas: 12, categoria: 'almuerzo' },
  { nombre: 'Arroz con pollo', calorias: 520, proteinas: 32, carbohidratos: 58, grasas: 18, categoria: 'almuerzo' },
  { nombre: 'Seco de res', calorias: 580, proteinas: 35, carbohidratos: 48, grasas: 26, categoria: 'almuerzo' },
  { nombre: 'Seco de cordero', calorias: 620, proteinas: 38, carbohidratos: 45, grasas: 30, categoria: 'almuerzo' },
  { nombre: 'Estofado de pollo', calorias: 450, proteinas: 30, carbohidratos: 42, grasas: 18, categoria: 'almuerzo' },
  { nombre: 'Estofado de carne', calorias: 520, proteinas: 32, carbohidratos: 40, grasas: 24, categoria: 'almuerzo' },
  { nombre: 'Carapulcra con sopa seca', calorias: 720, proteinas: 38, carbohidratos: 68, grasas: 32, categoria: 'almuerzo' },
  { nombre: 'Tacu tacu con bistec', calorias: 680, proteinas: 40, carbohidratos: 62, grasas: 30, categoria: 'almuerzo' },
  { nombre: 'Tacu tacu con lomo', calorias: 720, proteinas: 42, carbohidratos: 65, grasas: 32, categoria: 'almuerzo' },
  { nombre: 'Arroz tapado', calorias: 640, proteinas: 35, carbohidratos: 72, grasas: 24, categoria: 'almuerzo' },
  { nombre: 'Mondonguito a la italiana', calorias: 480, proteinas: 28, carbohidratos: 45, grasas: 20, categoria: 'almuerzo' },
  { nombre: 'Chanfainita', calorias: 520, proteinas: 32, carbohidratos: 38, grasas: 26, categoria: 'almuerzo' },
  { nombre: 'Olluquito con charqui', calorias: 450, proteinas: 30, carbohidratos: 42, grasas: 18, categoria: 'almuerzo' },
  { nombre: 'Pachamanca', calorias: 680, proteinas: 45, carbohidratos: 48, grasas: 32, categoria: 'almuerzo' },
  { nombre: 'Anticuchos (3 palitos)', calorias: 420, proteinas: 36, carbohidratos: 12, grasas: 24, categoria: 'almuerzo' },
  { nombre: 'Pollo al horno con papas', calorias: 550, proteinas: 38, carbohidratos: 45, grasas: 24, categoria: 'almuerzo' },
  { nombre: 'Bisteck a lo pobre', calorias: 780, proteinas: 45, carbohidratos: 62, grasas: 38, categoria: 'almuerzo' },
  { nombre: 'Milanesa de pollo', calorias: 520, proteinas: 32, carbohidratos: 38, grasas: 26, categoria: 'almuerzo' },
  { nombre: 'Milanesa de res', calorias: 560, proteinas: 34, carbohidratos: 36, grasas: 30, categoria: 'almuerzo' },
  { nombre: 'Chicharrón de cerdo', calorias: 720, proteinas: 42, carbohidratos: 8, grasas: 58, categoria: 'almuerzo' },
  { nombre: 'Chicharrón de pollo', calorias: 580, proteinas: 38, carbohidratos: 35, grasas: 32, categoria: 'almuerzo' },
  { nombre: 'Chicharrón de pescado', calorias: 520, proteinas: 35, carbohidratos: 32, grasas: 28, categoria: 'almuerzo' },
  { nombre: 'Apanado de pollo', calorias: 550, proteinas: 36, carbohidratos: 38, grasas: 28, categoria: 'almuerzo' },
  { nombre: 'Escabeche de pollo', calorias: 480, proteinas: 32, carbohidratos: 35, grasas: 22, categoria: 'almuerzo' },
  { nombre: 'Escabeche de pescado', calorias: 460, proteinas: 30, carbohidratos: 38, grasas: 20, categoria: 'almuerzo' },
  { nombre: 'Sudado de pescado', calorias: 320, proteinas: 35, carbohidratos: 22, grasas: 10, categoria: 'almuerzo' },
  { nombre: 'Picante de mariscos', calorias: 420, proteinas: 32, carbohidratos: 28, grasas: 18, categoria: 'almuerzo' },
  { nombre: 'Arroz con mariscos', calorias: 480, proteinas: 28, carbohidratos: 58, grasas: 16, categoria: 'almuerzo' },
  { nombre: 'Jalea mixta', calorias: 620, proteinas: 38, carbohidratos: 42, grasas: 32, categoria: 'almuerzo' },
  { nombre: 'Chaufa de mariscos', calorias: 600, proteinas: 26, carbohidratos: 70, grasas: 22, categoria: 'almuerzo' },
  { nombre: 'Aeropuerto (chaufa + tallarin)', calorias: 720, proteinas: 24, carbohidratos: 88, grasas: 28, categoria: 'almuerzo' },
  
  // Sopas peruanas
  { nombre: 'Sopa de pollo', calorias: 180, proteinas: 15, carbohidratos: 20, grasas: 5, categoria: 'almuerzo' },
  { nombre: 'Caldo de gallina', calorias: 200, proteinas: 18, carbohidratos: 15, grasas: 8, categoria: 'almuerzo' },
  { nombre: 'Aguadito de pollo', calorias: 280, proteinas: 22, carbohidratos: 28, grasas: 10, categoria: 'almuerzo' },
  { nombre: 'Aguadito de mariscos', calorias: 320, proteinas: 24, carbohidratos: 32, grasas: 12, categoria: 'almuerzo' },
  { nombre: 'Chupe de camarones', calorias: 380, proteinas: 26, carbohidratos: 35, grasas: 16, categoria: 'almuerzo' },
  { nombre: 'Parihuela', calorias: 320, proteinas: 28, carbohidratos: 25, grasas: 12, categoria: 'almuerzo' },
  { nombre: 'Sancochado', calorias: 420, proteinas: 28, carbohidratos: 45, grasas: 14, categoria: 'almuerzo' },
  { nombre: 'Shambar', calorias: 380, proteinas: 18, carbohidratos: 52, grasas: 12, categoria: 'almuerzo' },
  { nombre: 'Chilcano de pescado', calorias: 180, proteinas: 20, carbohidratos: 12, grasas: 6, categoria: 'almuerzo' },
  { nombre: 'Sopa seca', calorias: 480, proteinas: 18, carbohidratos: 68, grasas: 16, categoria: 'almuerzo' },
  { nombre: 'Sopa criolla', calorias: 220, proteinas: 12, carbohidratos: 28, grasas: 8, categoria: 'almuerzo' },
  { nombre: 'Sopa de verduras', calorias: 150, proteinas: 5, carbohidratos: 28, grasas: 3, categoria: 'almuerzo' },
  { nombre: 'Sopa instantánea (maruchan)', calorias: 380, proteinas: 8, carbohidratos: 52, grasas: 14, categoria: 'almuerzo' },
  
  // Entrada peruanas
  { nombre: 'Tiradito', calorias: 220, proteinas: 28, carbohidratos: 12, grasas: 8, categoria: 'almuerzo' },
  { nombre: 'Leche de tigre', calorias: 120, proteinas: 15, carbohidratos: 10, grasas: 3, categoria: 'almuerzo' },
  { nombre: 'Ocopa', calorias: 320, proteinas: 8, carbohidratos: 28, grasas: 20, categoria: 'almuerzo' },
  { nombre: 'Papa rellena', calorias: 380, proteinas: 14, carbohidratos: 42, grasas: 18, categoria: 'almuerzo' },
  { nombre: 'Yuca rellena', calorias: 420, proteinas: 12, carbohidratos: 52, grasas: 18, categoria: 'almuerzo' },
  { nombre: 'Tequeños (5 unidades)', calorias: 380, proteinas: 12, carbohidratos: 35, grasas: 22, categoria: 'almuerzo' },
  { nombre: 'Wantán frito (6 unidades)', calorias: 420, proteinas: 15, carbohidratos: 38, grasas: 24, categoria: 'almuerzo' },
  { nombre: 'Choritos a la chalaca', calorias: 180, proteinas: 12, carbohidratos: 15, grasas: 8, categoria: 'almuerzo' },
  { nombre: 'Conchitas a la parmesana (6 und)', calorias: 280, proteinas: 18, carbohidratos: 12, grasas: 18, categoria: 'almuerzo' },
  
  // Menestras y guisos
  { nombre: 'Arroz con frijoles', calorias: 420, proteinas: 14, carbohidratos: 72, grasas: 8, categoria: 'almuerzo' },
  { nombre: 'Arroz con lentejas', calorias: 400, proteinas: 16, carbohidratos: 68, grasas: 7, categoria: 'almuerzo' },
  { nombre: 'Frijoles con seco', calorias: 520, proteinas: 28, carbohidratos: 58, grasas: 18, categoria: 'almuerzo' },
  { nombre: 'Lentejas guisadas', calorias: 280, proteinas: 14, carbohidratos: 42, grasas: 6, categoria: 'almuerzo' },
  { nombre: 'Pallares guisados', calorias: 320, proteinas: 16, carbohidratos: 48, grasas: 8, categoria: 'almuerzo' },
  
  // Hamburguesas
  { nombre: 'Hamburguesa de carne', calorias: 550, proteinas: 28, carbohidratos: 45, grasas: 28, categoria: 'almuerzo' },
  { nombre: 'Hamburguesa de pollo', calorias: 480, proteinas: 32, carbohidratos: 42, grasas: 20, categoria: 'almuerzo' },
  { nombre: 'Hamburguesa doble carne', calorias: 750, proteinas: 45, carbohidratos: 50, grasas: 40, categoria: 'almuerzo' },
  { nombre: 'Hamburguesa con queso y tocino', calorias: 680, proteinas: 35, carbohidratos: 45, grasas: 38, categoria: 'almuerzo' },
  
  // Pizza
  { nombre: 'Pizza de jamón (2 rebanadas)', calorias: 500, proteinas: 20, carbohidratos: 60, grasas: 18, categoria: 'almuerzo' },
  { nombre: 'Pizza de pepperoni (2 rebanadas)', calorias: 520, proteinas: 22, carbohidratos: 58, grasas: 22, categoria: 'almuerzo' },
  { nombre: 'Pizza hawaiana (2 rebanadas)', calorias: 480, proteinas: 18, carbohidratos: 62, grasas: 16, categoria: 'almuerzo' },
  { nombre: 'Pizza personal completa', calorias: 800, proteinas: 30, carbohidratos: 90, grasas: 32, categoria: 'almuerzo' },
  
  // Pollo a la brasa y fritos
  { nombre: 'Pollo a la brasa 1/4 con papas', calorias: 600, proteinas: 40, carbohidratos: 45, grasas: 28, categoria: 'almuerzo' },
  { nombre: 'Alitas de pollo (6 unidades)', calorias: 450, proteinas: 35, carbohidratos: 12, grasas: 28, categoria: 'almuerzo' },
  { nombre: 'Nuggets de pollo (6 unidades)', calorias: 350, proteinas: 18, carbohidratos: 28, grasas: 18, categoria: 'almuerzo' },
  
  // Comida peruana/criolla
  { nombre: 'Ceviche', calorias: 300, proteinas: 35, carbohidratos: 20, grasas: 8, categoria: 'almuerzo' },
  { nombre: 'Lomo saltado', calorias: 650, proteinas: 35, carbohidratos: 65, grasas: 25, categoria: 'almuerzo' },
  { nombre: 'Causa rellena', calorias: 320, proteinas: 12, carbohidratos: 45, grasas: 10, categoria: 'almuerzo' },
  { nombre: 'Papa a la huancaína', calorias: 280, proteinas: 8, carbohidratos: 35, grasas: 12, categoria: 'almuerzo' },
  { nombre: 'Tallarín saltado', calorias: 580, proteinas: 28, carbohidratos: 70, grasas: 20, categoria: 'almuerzo' },
  
  // Tacos y mexicana
  { nombre: 'Tacos de carne (3 unidades)', calorias: 450, proteinas: 25, carbohidratos: 40, grasas: 20, categoria: 'almuerzo' },
  { nombre: 'Tacos de pollo (3 unidades)', calorias: 420, proteinas: 28, carbohidratos: 38, grasas: 16, categoria: 'almuerzo' },
  { nombre: 'Burrito de carne', calorias: 600, proteinas: 30, carbohidratos: 65, grasas: 22, categoria: 'almuerzo' },
  { nombre: 'Burrito de pollo', calorias: 550, proteinas: 32, carbohidratos: 62, grasas: 18, categoria: 'almuerzo' },
  { nombre: 'Quesadilla de queso', calorias: 450, proteinas: 18, carbohidratos: 42, grasas: 22, categoria: 'almuerzo' },
  
  // Sándwiches
  { nombre: 'Sándwich de jamón y queso', calorias: 320, proteinas: 15, carbohidratos: 35, grasas: 12, categoria: 'almuerzo' },
  { nombre: 'Sándwich de pollo', calorias: 380, proteinas: 25, carbohidratos: 38, grasas: 14, categoria: 'almuerzo' },
  { nombre: 'Sándwich triple', calorias: 450, proteinas: 22, carbohidratos: 42, grasas: 20, categoria: 'almuerzo' },
  { nombre: 'Hot dog completo', calorias: 350, proteinas: 12, carbohidratos: 38, grasas: 16, categoria: 'almuerzo' },
  { nombre: 'Salchipapa', calorias: 520, proteinas: 14, carbohidratos: 55, grasas: 26, categoria: 'almuerzo' },
  
  // Sopas
  { nombre: 'Sopa de pollo', calorias: 180, proteinas: 15, carbohidratos: 20, grasas: 5, categoria: 'almuerzo' },
  { nombre: 'Sopa de verduras', calorias: 150, proteinas: 5, carbohidratos: 28, grasas: 3, categoria: 'almuerzo' },
  { nombre: 'Caldo de gallina', calorias: 200, proteinas: 18, carbohidratos: 15, grasas: 8, categoria: 'almuerzo' },
  { nombre: 'Sopa instantánea (maruchan)', calorias: 380, proteinas: 8, carbohidratos: 52, grasas: 14, categoria: 'almuerzo' },
  
  // Ensaladas
  { nombre: 'Ensalada césar con pollo', calorias: 350, proteinas: 28, carbohidratos: 18, grasas: 20, categoria: 'almuerzo' },
  { nombre: 'Ensalada verde simple', calorias: 100, proteinas: 3, carbohidratos: 15, grasas: 4, categoria: 'almuerzo' },
  { nombre: 'Ensalada de atún', calorias: 280, proteinas: 22, carbohidratos: 12, grasas: 16, categoria: 'almuerzo' },
  
  // ========== CENAS ==========
  { nombre: 'Pollo a la plancha con ensalada', calorias: 250, proteinas: 32, carbohidratos: 10, grasas: 10, categoria: 'cena' },
  { nombre: 'Pescado al horno', calorias: 220, proteinas: 28, carbohidratos: 5, grasas: 9, categoria: 'cena' },
  { nombre: 'Atún con verduras', calorias: 200, proteinas: 24, carbohidratos: 12, grasas: 7, categoria: 'cena' },
  { nombre: 'Tortilla de verduras', calorias: 180, proteinas: 12, carbohidratos: 15, grasas: 8, categoria: 'cena' },
  { nombre: 'Ensalada de frutas', calorias: 150, proteinas: 2, carbohidratos: 35, grasas: 1, categoria: 'cena' },
  { nombre: 'Sopa de verduras', calorias: 150, proteinas: 5, carbohidratos: 28, grasas: 3, categoria: 'cena' },
  { nombre: 'Sándwich ligero', calorias: 280, proteinas: 12, carbohidratos: 32, grasas: 10, categoria: 'cena' },
  { nombre: 'Yogurt con frutas', calorias: 180, proteinas: 8, carbohidratos: 30, grasas: 4, categoria: 'cena' },
  { nombre: 'Huevos revueltos', calorias: 180, proteinas: 14, carbohidratos: 2, grasas: 12, categoria: 'cena' },
  
  // ========== MERIENDAS / SNACKS ==========
  // Frutas
  { nombre: 'Manzana', calorias: 80, proteinas: 0, carbohidratos: 21, grasas: 0, categoria: 'merienda' },
  { nombre: 'Banana/Plátano', calorias: 100, proteinas: 1, carbohidratos: 27, grasas: 0, categoria: 'merienda' },
  { nombre: 'Naranja', calorias: 60, proteinas: 1, carbohidratos: 15, grasas: 0, categoria: 'merienda' },
  { nombre: 'Pera', calorias: 70, proteinas: 0, carbohidratos: 18, grasas: 0, categoria: 'merienda' },
  { nombre: 'Uvas (1 taza)', calorias: 90, proteinas: 1, carbohidratos: 24, grasas: 0, categoria: 'merienda' },
  { nombre: 'Sandía (2 tajadas)', calorias: 80, proteinas: 1, carbohidratos: 20, grasas: 0, categoria: 'merienda' },
  { nombre: 'Piña (2 rodajas)', calorias: 85, proteinas: 1, carbohidratos: 22, grasas: 0, categoria: 'merienda' },
  
  // Snacks empaquetados
  { nombre: 'Papas Lays (bolsa pequeña)', calorias: 150, proteinas: 2, carbohidratos: 15, grasas: 10, categoria: 'merienda' },
  { nombre: 'Doritos (bolsa pequeña)', calorias: 160, proteinas: 2, carbohidratos: 18, grasas: 9, categoria: 'merienda' },
  { nombre: 'Cheetos (bolsa pequeña)', calorias: 170, proteinas: 2, carbohidratos: 16, grasas: 11, categoria: 'merienda' },
  { nombre: 'Pringles (20 hojuelas)', calorias: 150, proteinas: 1, carbohidratos: 15, grasas: 10, categoria: 'merienda' },
  
  // Dulces y chocolates
  { nombre: 'Chocolate Sublime', calorias: 220, proteinas: 3, carbohidratos: 28, grasas: 12, categoria: 'merienda' },
  { nombre: 'Chocolate Snickers', calorias: 250, proteinas: 4, carbohidratos: 33, grasas: 12, categoria: 'merienda' },
  { nombre: 'Chocolate Kit Kat', calorias: 210, proteinas: 3, carbohidratos: 27, grasas: 11, categoria: 'merienda' },
  { nombre: 'Galletas Oreo (3 unidades)', calorias: 160, proteinas: 2, carbohidratos: 25, grasas: 7, categoria: 'merienda' },
  { nombre: 'Galletas de soda (4 unidades)', calorias: 120, proteinas: 2, carbohidratos: 20, grasas: 4, categoria: 'merienda' },
  { nombre: 'Galletas dulces (4 unidades)', calorias: 200, proteinas: 3, carbohidratos: 30, grasas: 8, categoria: 'merienda' },
  { nombre: 'Donas (1 unidad)', calorias: 250, proteinas: 4, carbohidratos: 35, grasas: 12, categoria: 'merienda' },
  { nombre: 'Brownie', calorias: 280, proteinas: 4, carbohidratos: 38, grasas: 14, categoria: 'merienda' },
  { nombre: 'Churros (3 unidades)', calorias: 300, proteinas: 4, carbohidratos: 42, grasas: 14, categoria: 'merienda' },
  
  // Frutos secos
  { nombre: 'Maní (puñado)', calorias: 180, proteinas: 8, carbohidratos: 6, grasas: 14, categoria: 'merienda' },
  { nombre: 'Almendras (puñado)', calorias: 170, proteinas: 6, carbohidratos: 6, grasas: 15, categoria: 'merienda' },
  { nombre: 'Nueces (puñado)', calorias: 185, proteinas: 4, carbohidratos: 4, grasas: 18, categoria: 'merienda' },
  { nombre: 'Pasas (puñado)', calorias: 120, proteinas: 1, carbohidratos: 32, grasas: 0, categoria: 'merienda' },
  
  // Yogurt y lácteos (GLORIA - lo más comprado)
  { nombre: 'Yogurt Gloria frutado', calorias: 120, proteinas: 6, carbohidratos: 20, grasas: 2, categoria: 'merienda' },
  { nombre: 'Yogurt Gloria griego', calorias: 150, proteinas: 12, carbohidratos: 15, grasas: 5, categoria: 'merienda' },
  { nombre: 'Yogurt Gloria Yofresh', calorias: 100, proteinas: 5, carbohidratos: 18, grasas: 1, categoria: 'merienda' },
  { nombre: 'Gloria Pro sabores', calorias: 140, proteinas: 10, carbohidratos: 18, grasas: 3, categoria: 'merienda' },
  { nombre: 'Laive yogurt', calorias: 130, proteinas: 7, carbohidratos: 20, grasas: 3, categoria: 'merienda' },
  { nombre: 'Yoleit', calorias: 110, proteinas: 6, carbohidratos: 18, grasas: 2, categoria: 'merienda' },
  { nombre: 'BioGurt', calorias: 115, proteinas: 6, carbohidratos: 19, grasas: 2, categoria: 'merienda' },
  { nombre: 'Leche chocolatada Gloria', calorias: 180, proteinas: 8, carbohidratos: 28, grasas: 5, categoria: 'merienda' },
  { nombre: 'Leche chocolatada Nesquik', calorias: 190, proteinas: 8, carbohidratos: 30, grasas: 5, categoria: 'merienda' },
  
  // Embutidos y fiambres (para lonchera/snacks)
  { nombre: 'Jamonada Gloria (2 tajadas)', calorias: 80, proteinas: 6, carbohidratos: 2, grasas: 5, categoria: 'merienda' },
  { nombre: 'Jamón del país (2 tajadas)', calorias: 90, proteinas: 8, carbohidratos: 2, grasas: 6, categoria: 'merienda' },
  { nombre: 'Mortadela (2 tajadas)', calorias: 110, proteinas: 5, carbohidratos: 3, grasas: 9, categoria: 'merienda' },
  { nombre: 'Hot dog (1 unidad)', calorias: 150, proteinas: 6, carbohidratos: 2, grasas: 13, categoria: 'merienda' },
  { nombre: 'Salchicha (1 unidad)', calorias: 140, proteinas: 5, carbohidratos: 2, grasas: 12, categoria: 'merienda' },
  { nombre: 'Queso fresco (tajada)', calorias: 70, proteinas: 5, carbohidratos: 1, grasas: 5, categoria: 'merienda' },
  { nombre: 'Queso Bonlé (tajada)', calorias: 80, proteinas: 6, carbohidratos: 1, grasas: 6, categoria: 'merienda' },
  { nombre: 'Queso edam (tajada)', calorias: 90, proteinas: 7, carbohidratos: 1, grasas: 7, categoria: 'merienda' },
  
  // Palta y otros (esenciales peruanos)
  { nombre: 'Palta (1/2 unidad)', calorias: 120, proteinas: 2, carbohidratos: 6, grasas: 11, categoria: 'merienda' },
  { nombre: 'Palta entera', calorias: 240, proteinas: 3, carbohidratos: 12, grasas: 22, categoria: 'merienda' },
  { nombre: 'Aceitunas (10 unidades)', calorias: 50, proteinas: 0, carbohidratos: 3, grasas: 5, categoria: 'merienda' },
  { nombre: 'Choclo sancochado', calorias: 130, proteinas: 4, carbohidratos: 28, grasas: 2, categoria: 'merienda' },
  { nombre: 'Camote sancochado', calorias: 110, proteinas: 2, carbohidratos: 26, grasas: 0, categoria: 'merienda' },
  { nombre: 'Yuca sancochada', calorias: 120, proteinas: 1, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  
  // Panes y masas (lo que mamá compra en panadería)
  { nombre: 'Pan francés (1 unidad)', calorias: 130, proteinas: 4, carbohidratos: 26, grasas: 1, categoria: 'merienda' },
  { nombre: 'Pan ciabatta', calorias: 150, proteinas: 5, carbohidratos: 28, grasas: 2, categoria: 'merienda' },
  { nombre: 'Pan integral (tajada)', calorias: 70, proteinas: 3, carbohidratos: 12, grasas: 1, categoria: 'merienda' },
  { nombre: 'Pan de molde Bimbo (tajada)', calorias: 80, proteinas: 3, carbohidratos: 14, grasas: 2, categoria: 'merienda' },
  { nombre: 'Pan de molde integral (tajada)', calorias: 65, proteinas: 3, carbohidratos: 11, grasas: 1, categoria: 'merienda' },
  { nombre: 'Pan con ajonjolí', calorias: 140, proteinas: 5, carbohidratos: 25, grasas: 3, categoria: 'merienda' },
  { nombre: 'Cachito', calorias: 200, proteinas: 5, carbohidratos: 28, grasas: 8, categoria: 'merienda' },
  { nombre: 'Croissant', calorias: 230, proteinas: 5, carbohidratos: 26, grasas: 12, categoria: 'merienda' },
  { nombre: 'Pan de yema', calorias: 180, proteinas: 5, carbohidratos: 30, grasas: 5, categoria: 'merienda' },
  { nombre: 'Bizcocho', calorias: 160, proteinas: 4, carbohidratos: 28, grasas: 4, categoria: 'merienda' },
  { nombre: 'Rosquitas (3 unidades)', calorias: 150, proteinas: 3, carbohidratos: 26, grasas: 4, categoria: 'merienda' },
  { nombre: 'Pan con pasas', calorias: 170, proteinas: 4, carbohidratos: 32, grasas: 3, categoria: 'merienda' },
  
  // Galletas peruanas (marcas que mamá compra)
  { nombre: 'Galletas Soda Field (4 unidades)', calorias: 120, proteinas: 2, carbohidratos: 20, grasas: 4, categoria: 'merienda' },
  { nombre: 'Galletas Casino (4 unidades)', calorias: 200, proteinas: 3, carbohidratos: 30, grasas: 8, categoria: 'merienda' },
  { nombre: 'Galletas Tentación', calorias: 180, proteinas: 2, carbohidratos: 28, grasas: 7, categoria: 'merienda' },
  { nombre: 'Galletas Fénix', calorias: 190, proteinas: 3, carbohidratos: 29, grasas: 7, categoria: 'merienda' },
  { nombre: 'Galletas Morochas (4 unidades)', calorias: 210, proteinas: 3, carbohidratos: 32, grasas: 8, categoria: 'merienda' },
  { nombre: 'Galletas Cremoleta', calorias: 140, proteinas: 2, carbohidratos: 22, grasas: 5, categoria: 'merienda' },
  { nombre: 'Galletas Ritz (5 unidades)', calorias: 130, proteinas: 2, carbohidratos: 18, grasas: 6, categoria: 'merienda' },
  { nombre: 'Galletas Soda San Jorge', calorias: 115, proteinas: 2, carbohidratos: 19, grasas: 4, categoria: 'merienda' },
  
  // Dulces peruanos
  { nombre: 'Chocotejas (2 unidades)', calorias: 180, proteinas: 2, carbohidratos: 24, grasas: 9, categoria: 'merienda' },
  { nombre: 'Turrón de Doña Pepa (tajada)', calorias: 220, proteinas: 3, carbohidratos: 38, grasas: 7, categoria: 'merienda' },
  { nombre: 'Mazapán (1 unidad)', calorias: 150, proteinas: 3, carbohidratos: 25, grasas: 5, categoria: 'merienda' },
  { nombre: 'Revolución Caliente', calorias: 200, proteinas: 3, carbohidratos: 32, grasas: 7, categoria: 'merienda' },
  { nombre: 'King Kong (porción)', calorias: 280, proteinas: 4, carbohidratos: 45, grasas: 10, categoria: 'merienda' },
  { nombre: 'Alfajor Triple (Triton)', calorias: 230, proteinas: 3, carbohidratos: 35, grasas: 9, categoria: 'merienda' },
  { nombre: 'Wafer Mecano', calorias: 170, proteinas: 2, carbohidratos: 25, grasas: 7, categoria: 'merienda' },
  { nombre: 'Chocolate Princesa', calorias: 210, proteinas: 3, carbohidratos: 27, grasas: 11, categoria: 'merienda' },
  { nombre: 'Chocolate Winter', calorias: 240, proteinas: 4, carbohidratos: 30, grasas: 13, categoria: 'merienda' },
  { nombre: 'Cua Cua (paquete)', calorias: 160, proteinas: 2, carbohidratos: 24, grasas: 6, categoria: 'merienda' },
  { nombre: 'Chocman', calorias: 180, proteinas: 3, carbohidratos: 26, grasas: 7, categoria: 'merienda' },
  { nombre: 'Nik (paquete)', calorias: 190, proteinas: 3, carbohidratos: 28, grasas: 8, categoria: 'merienda' },
  { nombre: 'Picarones (3 unidades)', calorias: 420, proteinas: 5, carbohidratos: 68, grasas: 14, categoria: 'merienda' },
  { nombre: 'Mazamorra morada (taza)', calorias: 180, proteinas: 2, carbohidratos: 42, grasas: 1, categoria: 'merienda' },
  { nombre: 'Arroz con leche (taza)', calorias: 290, proteinas: 8, carbohidratos: 52, grasas: 6, categoria: 'merienda' },
  { nombre: 'Suspiro limeño', calorias: 300, proteinas: 5, carbohidratos: 48, grasas: 10, categoria: 'merienda' },
  { nombre: 'Frejol colado', calorias: 220, proteinas: 6, carbohidratos: 42, grasas: 4, categoria: 'merienda' },
  { nombre: 'Champús', calorias: 180, proteinas: 2, carbohidratos: 42, grasas: 1, categoria: 'merienda' },
  { nombre: 'Ranfañote', calorias: 320, proteinas: 6, carbohidratos: 52, grasas: 10, categoria: 'merienda' },
  
  // Snacks peruanos callejeros
  { nombre: 'Cancha serrana (puñado)', calorias: 120, proteinas: 4, carbohidratos: 22, grasas: 2, categoria: 'merienda' },
  { nombre: 'Habas tostadas (puñado)', calorias: 140, proteinas: 8, carbohidratos: 20, grasas: 3, categoria: 'merienda' },
  { nombre: 'Chifles (bolsita)', calorias: 280, proteinas: 2, carbohidratos: 38, grasas: 14, categoria: 'merienda' },
  { nombre: 'Yuquitas (bolsita)', calorias: 300, proteinas: 3, carbohidratos: 42, grasas: 14, categoria: 'merienda' },
  { nombre: 'Camotitos (bolsita)', calorias: 290, proteinas: 2, carbohidratos: 40, grasas: 13, categoria: 'merienda' },
  { nombre: 'Turrón (1 barra)', calorias: 180, proteinas: 4, carbohidratos: 32, grasas: 5, categoria: 'merienda' },
  { nombre: 'Chancay (1 unidad)', calorias: 140, proteinas: 3, carbohidratos: 26, grasas: 3, categoria: 'merienda' },
  { nombre: 'Bizcocho (1 unidad)', calorias: 200, proteinas: 4, carbohidratos: 34, grasas: 6, categoria: 'merienda' },
  { nombre: 'Rosquitas (3 unidades)', calorias: 180, proteinas: 3, carbohidratos: 30, grasas: 5, categoria: 'merienda' },
  { nombre: 'Pan de camote', calorias: 190, proteinas: 4, carbohidratos: 35, grasas: 4, categoria: 'merienda' },
  { nombre: 'Pan chapla', calorias: 160, proteinas: 4, carbohidratos: 30, grasas: 3, categoria: 'merienda' },
  
  // ========== BEBIDAS ==========
  // Gaseosas regulares
  { nombre: 'Inka Cola (lata 350ml)', calorias: 140, proteinas: 0, carbohidratos: 37, grasas: 0, categoria: 'merienda' },
  { nombre: 'Inka Cola (botella 500ml)', calorias: 200, proteinas: 0, carbohidratos: 53, grasas: 0, categoria: 'merienda' },
  { nombre: 'Inka Cola (botella 1.5L)', calorias: 600, proteinas: 0, carbohidratos: 159, grasas: 0, categoria: 'merienda' },
  { nombre: 'Coca Cola (lata 350ml)', calorias: 140, proteinas: 0, carbohidratos: 37, grasas: 0, categoria: 'merienda' },
  { nombre: 'Coca Cola (botella 500ml)', calorias: 200, proteinas: 0, carbohidratos: 53, grasas: 0, categoria: 'merienda' },
  { nombre: 'Coca Cola (botella 1.5L)', calorias: 600, proteinas: 0, carbohidratos: 159, grasas: 0, categoria: 'merienda' },
  { nombre: 'Sprite (lata)', calorias: 140, proteinas: 0, carbohidratos: 38, grasas: 0, categoria: 'merienda' },
  { nombre: 'Fanta (lata)', calorias: 150, proteinas: 0, carbohidratos: 40, grasas: 0, categoria: 'merienda' },
  { nombre: 'Pepsi (lata)', calorias: 150, proteinas: 0, carbohidratos: 41, grasas: 0, categoria: 'merienda' },
  { nombre: 'Guaraná (lata)', calorias: 140, proteinas: 0, carbohidratos: 37, grasas: 0, categoria: 'merienda' },
  { nombre: 'Kola Real (botella 500ml)', calorias: 200, proteinas: 0, carbohidratos: 52, grasas: 0, categoria: 'merienda' },
  
  // Gaseosas ZERO/Light
  { nombre: 'Coca Cola Zero (lata)', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  { nombre: 'Coca Cola Zero (botella 500ml)', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  { nombre: 'Inka Cola Zero (lata)', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  { nombre: 'Inka Cola Zero (botella 500ml)', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  { nombre: 'Sprite Zero (lata)', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  { nombre: 'Fanta Zero (lata)', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  
  // Jugos naturales
  { nombre: 'Jugo de naranja natural (vaso)', calorias: 110, proteinas: 2, carbohidratos: 26, grasas: 0, categoria: 'merienda' },
  { nombre: 'Jugo de piña natural (vaso)', calorias: 120, proteinas: 1, carbohidratos: 30, grasas: 0, categoria: 'merienda' },
  { nombre: 'Jugo de papaya natural (vaso)', calorias: 100, proteinas: 1, carbohidratos: 25, grasas: 0, categoria: 'merienda' },
  { nombre: 'Jugo de sandía natural (vaso)', calorias: 90, proteinas: 1, carbohidratos: 22, grasas: 0, categoria: 'merienda' },
  { nombre: 'Jugo de fresa natural (vaso)', calorias: 95, proteinas: 1, carbohidratos: 24, grasas: 0, categoria: 'merienda' },
  { nombre: 'Limonada natural (vaso)', calorias: 80, proteinas: 0, carbohidratos: 20, grasas: 0, categoria: 'merienda' },
  { nombre: 'Chicha morada (vaso)', calorias: 130, proteinas: 1, carbohidratos: 32, grasas: 0, categoria: 'merienda' },
  { nombre: 'Jugo de maracuyá (vaso)', calorias: 110, proteinas: 2, carbohidratos: 26, grasas: 0, categoria: 'merienda' },
  { nombre: 'Jugo de lúcuma (vaso)', calorias: 140, proteinas: 2, carbohidratos: 32, grasas: 1, categoria: 'merienda' },
  { nombre: 'Jugo de mango (vaso)', calorias: 125, proteinas: 1, carbohidratos: 30, grasas: 0, categoria: 'merienda' },
  { nombre: 'Jugo de piña con maracuyá (vaso)', calorias: 115, proteinas: 1, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  { nombre: 'Jugo surtido (vaso)', calorias: 130, proteinas: 2, carbohidratos: 31, grasas: 0, categoria: 'merienda' },
  { nombre: 'Jugo especial (vaso)', calorias: 145, proteinas: 2, carbohidratos: 34, grasas: 1, categoria: 'merienda' },
  { nombre: 'Cremolada (vaso)', calorias: 150, proteinas: 0, carbohidratos: 38, grasas: 0, categoria: 'merienda' },
  { nombre: 'Raspadilla (vaso)', calorias: 140, proteinas: 0, carbohidratos: 36, grasas: 0, categoria: 'merienda' },
  
  // Bebidas tradicionales peruanas
  { nombre: 'Chicha de jora (vaso)', calorias: 180, proteinas: 2, carbohidratos: 42, grasas: 1, categoria: 'merienda' },
  { nombre: 'Emoliente (vaso)', calorias: 120, proteinas: 1, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  { nombre: 'Quinua con manzana (vaso)', calorias: 160, proteinas: 5, carbohidratos: 32, grasas: 2, categoria: 'merienda' },
  { nombre: 'Maca (vaso)', calorias: 150, proteinas: 6, carbohidratos: 28, grasas: 2, categoria: 'merienda' },
  { nombre: 'Cebada (vaso)', calorias: 140, proteinas: 4, carbohidratos: 30, grasas: 1, categoria: 'merienda' },
  { nombre: 'Algarrobina (vaso)', calorias: 200, proteinas: 4, carbohidratos: 40, grasas: 3, categoria: 'merienda' },
  { nombre: 'Api morado (vaso)', calorias: 160, proteinas: 2, carbohidratos: 38, grasas: 1, categoria: 'merienda' },
  
  // Jugos envasados
  { nombre: 'Pulp naranja (tetrapack)', calorias: 120, proteinas: 1, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  { nombre: 'Pulp durazno (tetrapack)', calorias: 130, proteinas: 0, carbohidratos: 32, grasas: 0, categoria: 'merienda' },
  { nombre: 'Pulp mango (tetrapack)', calorias: 125, proteinas: 1, carbohidratos: 30, grasas: 0, categoria: 'merienda' },
  { nombre: 'Pulp piña (tetrapack)', calorias: 120, proteinas: 0, carbohidratos: 29, grasas: 0, categoria: 'merienda' },
  { nombre: 'Frugos naranja', calorias: 110, proteinas: 1, carbohidratos: 26, grasas: 0, categoria: 'merienda' },
  { nombre: 'Frugos piña', calorias: 115, proteinas: 0, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  { nombre: 'Frugos manzana', calorias: 110, proteinas: 0, carbohidratos: 27, grasas: 0, categoria: 'merienda' },
  { nombre: 'Frugos durazno', calorias: 115, proteinas: 0, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  { nombre: 'Frugos surtido', calorias: 110, proteinas: 1, carbohidratos: 26, grasas: 0, categoria: 'merienda' },
  { nombre: 'Cifrut surtido', calorias: 100, proteinas: 0, carbohidratos: 25, grasas: 0, categoria: 'merienda' },
  { nombre: 'Cifrut naranja', calorias: 100, proteinas: 1, carbohidratos: 24, grasas: 0, categoria: 'merienda' },
  { nombre: 'Cifrut manzana', calorias: 100, proteinas: 0, carbohidratos: 25, grasas: 0, categoria: 'merienda' },
  { nombre: 'Cifrut tropical', calorias: 105, proteinas: 0, carbohidratos: 26, grasas: 0, categoria: 'merienda' },
  { nombre: 'Selva jugos naranja', calorias: 115, proteinas: 1, carbohidratos: 27, grasas: 0, categoria: 'merienda' },
  { nombre: 'Selva jugos surtido', calorias: 115, proteinas: 1, carbohidratos: 27, grasas: 0, categoria: 'merienda' },
  { nombre: 'Watts naranja', calorias: 105, proteinas: 1, carbohidratos: 25, grasas: 0, categoria: 'merienda' },
  { nombre: 'Watts piña', calorias: 105, proteinas: 0, carbohidratos: 26, grasas: 0, categoria: 'merienda' },
  { nombre: 'Watts manzana', calorias: 105, proteinas: 0, carbohidratos: 26, grasas: 0, categoria: 'merienda' },
  
  // Bebidas energizantes
  { nombre: 'Red Bull (lata 250ml)', calorias: 110, proteinas: 0, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  { nombre: 'Red Bull (lata 355ml)', calorias: 160, proteinas: 0, carbohidratos: 40, grasas: 0, categoria: 'merienda' },
  { nombre: 'Monster Energy (lata 473ml)', calorias: 210, proteinas: 0, carbohidratos: 54, grasas: 0, categoria: 'merienda' },
  { nombre: 'Monster Ultra (lata)', calorias: 10, proteinas: 0, carbohidratos: 2, grasas: 0, categoria: 'merienda' },
  { nombre: 'Vive 100 (botella)', calorias: 140, proteinas: 0, carbohidratos: 35, grasas: 0, categoria: 'merienda' },
  { nombre: 'Volt (lata)', calorias: 130, proteinas: 0, carbohidratos: 32, grasas: 0, categoria: 'merienda' },
  { nombre: '360 Energy (lata)', calorias: 125, proteinas: 0, carbohidratos: 31, grasas: 0, categoria: 'merienda' },
  { nombre: 'Burn (lata)', calorias: 140, proteinas: 0, carbohidratos: 35, grasas: 0, categoria: 'merienda' },
  
  // Bebidas isotónicas/deportivas
  { nombre: 'Gatorade naranja (botella 500ml)', calorias: 120, proteinas: 0, carbohidratos: 30, grasas: 0, categoria: 'merienda' },
  { nombre: 'Gatorade limón (botella 500ml)', calorias: 120, proteinas: 0, carbohidratos: 30, grasas: 0, categoria: 'merienda' },
  { nombre: 'Gatorade frutas tropicales (botella 500ml)', calorias: 120, proteinas: 0, carbohidratos: 30, grasas: 0, categoria: 'merienda' },
  { nombre: 'Powerade naranja (botella 500ml)', calorias: 110, proteinas: 0, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  { nombre: 'Powerade manzana (botella 500ml)', calorias: 110, proteinas: 0, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  { nombre: 'Sporade naranja (botella 500ml)', calorias: 100, proteinas: 0, carbohidratos: 25, grasas: 0, categoria: 'merienda' },
  { nombre: 'Sporade limón (botella 500ml)', calorias: 100, proteinas: 0, carbohidratos: 25, grasas: 0, categoria: 'merienda' },
  
  // Refrescos en sobre (para preparar)
  { nombre: 'Zuko naranja (jarra 1L)', calorias: 280, proteinas: 0, carbohidratos: 70, grasas: 0, categoria: 'merienda' },
  { nombre: 'Zuko piña (jarra 1L)', calorias: 280, proteinas: 0, carbohidratos: 70, grasas: 0, categoria: 'merienda' },
  { nombre: 'Zuko fresa (jarra 1L)', calorias: 280, proteinas: 0, carbohidratos: 70, grasas: 0, categoria: 'merienda' },
  { nombre: 'Zuko limón (jarra 1L)', calorias: 280, proteinas: 0, carbohidratos: 70, grasas: 0, categoria: 'merienda' },
  { nombre: 'Zuko maracuyá (jarra 1L)', calorias: 280, proteinas: 0, carbohidratos: 70, grasas: 0, categoria: 'merienda' },
  { nombre: 'Fru-T naranja (jarra 1L)', calorias: 300, proteinas: 0, carbohidratos: 75, grasas: 0, categoria: 'merienda' },
  { nombre: 'Fru-T piña (jarra 1L)', calorias: 300, proteinas: 0, carbohidratos: 75, grasas: 0, categoria: 'merienda' },
  { nombre: 'Tang naranja (jarra 1L)', calorias: 290, proteinas: 0, carbohidratos: 72, grasas: 0, categoria: 'merienda' },
  { nombre: 'Tang piña (jarra 1L)', calorias: 290, proteinas: 0, carbohidratos: 72, grasas: 0, categoria: 'merienda' },
  { nombre: 'Tang maracuyá (jarra 1L)', calorias: 290, proteinas: 0, carbohidratos: 72, grasas: 0, categoria: 'merienda' },
  { nombre: 'Tampico (botella)', calorias: 140, proteinas: 0, carbohidratos: 35, grasas: 0, categoria: 'merienda' },
  
  // Energéticas
  { nombre: 'Red Bull (lata 250ml)', calorias: 110, proteinas: 1, carbohidratos: 27, grasas: 0, categoria: 'merienda' },
  { nombre: 'Monster Energy (lata)', calorias: 120, proteinas: 1, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  { nombre: 'Volt (lata)', calorias: 110, proteinas: 0, carbohidratos: 27, grasas: 0, categoria: 'merienda' },
  { nombre: 'Burn (lata)', calorias: 115, proteinas: 0, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  { nombre: 'Speed (lata)', calorias: 110, proteinas: 0, carbohidratos: 27, grasas: 0, categoria: 'merienda' },
  { nombre: 'Red Bull Sin Azúcar', calorias: 10, proteinas: 0, carbohidratos: 2, grasas: 0, categoria: 'merienda' },
  { nombre: 'Monster Zero', calorias: 10, proteinas: 0, carbohidratos: 2, grasas: 0, categoria: 'merienda' },
  
  // Bebidas deportivas
  { nombre: 'Sporade (botella)', calorias: 80, proteinas: 0, carbohidratos: 20, grasas: 0, categoria: 'merienda' },
  { nombre: 'Gatorade (botella)', calorias: 90, proteinas: 0, carbohidratos: 22, grasas: 0, categoria: 'merienda' },
  { nombre: 'Powerade (botella)', calorias: 85, proteinas: 0, carbohidratos: 21, grasas: 0, categoria: 'merienda' },
  
  // Agua
  { nombre: 'Agua (botella 500ml)', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  { nombre: 'Agua San Luis', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  { nombre: 'Agua Cielo', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  { nombre: 'Agua San Mateo', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  { nombre: 'Agua con gas', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  
  // Leche y derivados líquidos
  { nombre: 'Leche Gloria entera (vaso)', calorias: 150, proteinas: 8, carbohidratos: 12, grasas: 8, categoria: 'merienda' },
  { nombre: 'Leche descremada (vaso)', calorias: 90, proteinas: 9, carbohidratos: 12, grasas: 0, categoria: 'merienda' },
  { nombre: 'Leche evaporada (taza)', calorias: 170, proteinas: 9, carbohidratos: 13, grasas: 9, categoria: 'merienda' },
  { nombre: 'Leche de soya (vaso)', calorias: 100, proteinas: 7, carbohidratos: 12, grasas: 4, categoria: 'merienda' },
  { nombre: 'Leche de almendras (vaso)', calorias: 60, proteinas: 1, carbohidratos: 8, grasas: 3, categoria: 'merienda' },
  { nombre: 'Pura Vida sabores (botella)', calorias: 160, proteinas: 7, carbohidratos: 26, grasas: 3, categoria: 'merienda' },
  
  // Leches saborizadas Gloria Pro (botella 500ml)
  { nombre: 'Gloria Pro Vainilla', calorias: 345, proteinas: 18, carbohidratos: 52, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Pro Chocolate', calorias: 350, proteinas: 18, carbohidratos: 54, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Pro Fresa', calorias: 345, proteinas: 18, carbohidratos: 52, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Pro Lúcuma', calorias: 345, proteinas: 18, carbohidratos: 52, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Pro Capuchino', calorias: 345, proteinas: 18, carbohidratos: 52, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Pro Vainilla francesa', calorias: 345, proteinas: 18, carbohidratos: 52, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Pro Durazno', calorias: 345, proteinas: 18, carbohidratos: 52, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Pro Mango', calorias: 345, proteinas: 18, carbohidratos: 52, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Pro Plátano', calorias: 345, proteinas: 18, carbohidratos: 52, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Pro Café', calorias: 345, proteinas: 18, carbohidratos: 52, grasas: 7, categoria: 'merienda' },
  
  // Leches saborizadas Gloria Ángel (botella 500ml)
  { nombre: 'Gloria Ángel Vainilla', calorias: 330, proteinas: 16, carbohidratos: 50, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Ángel Chocolate', calorias: 335, proteinas: 16, carbohidratos: 52, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Ángel Fresa', calorias: 330, proteinas: 16, carbohidratos: 50, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Ángel Lúcuma', calorias: 330, proteinas: 16, carbohidratos: 50, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Ángel Durazno', calorias: 330, proteinas: 16, carbohidratos: 50, grasas: 7, categoria: 'merienda' },
  { nombre: 'Gloria Ángel Guanábana', calorias: 330, proteinas: 16, carbohidratos: 50, grasas: 7, categoria: 'merienda' },
  
  // Leches saborizadas Ideal (botella 500ml)
  { nombre: 'Ideal Vainilla', calorias: 320, proteinas: 15, carbohidratos: 48, grasas: 6, categoria: 'merienda' },
  { nombre: 'Ideal Chocolate', calorias: 325, proteinas: 15, carbohidratos: 50, grasas: 6, categoria: 'merienda' },
  { nombre: 'Ideal Fresa', calorias: 320, proteinas: 15, carbohidratos: 48, grasas: 6, categoria: 'merienda' },
  { nombre: 'Ideal Lúcuma', calorias: 320, proteinas: 15, carbohidratos: 48, grasas: 6, categoria: 'merienda' },
  { nombre: 'Ideal Durazno', calorias: 320, proteinas: 15, carbohidratos: 48, grasas: 6, categoria: 'merienda' },
  { nombre: 'Ideal Capuchino', calorias: 320, proteinas: 15, carbohidratos: 48, grasas: 6, categoria: 'merienda' },
  { nombre: 'Ideal Mango', calorias: 320, proteinas: 15, carbohidratos: 48, grasas: 6, categoria: 'merienda' },
  
  // Otras leches saborizadas
  { nombre: 'Laive Chocoleche', calorias: 340, proteinas: 17, carbohidratos: 51, grasas: 7, categoria: 'merienda' },
  { nombre: 'Laive Vainilla', calorias: 335, proteinas: 17, carbohidratos: 49, grasas: 7, categoria: 'merienda' },
  { nombre: 'Laive Fresa', calorias: 335, proteinas: 17, carbohidratos: 49, grasas: 7, categoria: 'merienda' },
  { nombre: 'Milk Shake Vainilla', calorias: 310, proteinas: 14, carbohidratos: 46, grasas: 7, categoria: 'merienda' },
  { nombre: 'Milk Shake Chocolate', calorias: 315, proteinas: 14, carbohidratos: 48, grasas: 7, categoria: 'merienda' },
  { nombre: 'Milk Shake Fresa', calorias: 310, proteinas: 14, carbohidratos: 46, grasas: 7, categoria: 'merienda' },
  
  // Yogurt bebible
  { nombre: 'Yogurt Gloria bebible', calorias: 120, proteinas: 6, carbohidratos: 20, grasas: 2, categoria: 'merienda' },
  { nombre: 'Yogurt Gloria bebible Fresa', calorias: 120, proteinas: 6, carbohidratos: 20, grasas: 2, categoria: 'merienda' },
  { nombre: 'Yogurt Gloria bebible Durazno', calorias: 120, proteinas: 6, carbohidratos: 20, grasas: 2, categoria: 'merienda' },
  { nombre: 'Yogurt Gloria bebible Lúcuma', calorias: 120, proteinas: 6, carbohidratos: 20, grasas: 2, categoria: 'merienda' },
  { nombre: 'Yogurt Gloria bebible Sauco', calorias: 120, proteinas: 6, carbohidratos: 20, grasas: 2, categoria: 'merienda' },
  { nombre: 'Yogurt Gloria bebible Vainilla', calorias: 120, proteinas: 6, carbohidratos: 20, grasas: 2, categoria: 'merienda' },
  { nombre: 'Laive bebible Fresa', calorias: 130, proteinas: 7, carbohidratos: 21, grasas: 2, categoria: 'merienda' },
  { nombre: 'Laive bebible Durazno', calorias: 130, proteinas: 7, carbohidratos: 21, grasas: 2, categoria: 'merienda' },
  { nombre: 'Laive bebible Guanábana', calorias: 130, proteinas: 7, carbohidratos: 21, grasas: 2, categoria: 'merienda' },
  { nombre: 'Laive bebible Lúcuma', calorias: 130, proteinas: 7, carbohidratos: 21, grasas: 2, categoria: 'merienda' },
  { nombre: 'Laive bebible Vainilla', calorias: 130, proteinas: 7, carbohidratos: 21, grasas: 2, categoria: 'merienda' },
  { nombre: 'Milkito Fresa', calorias: 140, proteinas: 6, carbohidratos: 23, grasas: 3, categoria: 'merienda' },
  { nombre: 'Milkito Vainilla', calorias: 140, proteinas: 6, carbohidratos: 23, grasas: 3, categoria: 'merienda' },
  { nombre: 'Milkito Chocolate', calorias: 145, proteinas: 6, carbohidratos: 24, grasas: 3, categoria: 'merienda' },
  { nombre: 'Milkito Durazno', calorias: 140, proteinas: 6, carbohidratos: 23, grasas: 3, categoria: 'merienda' },
  { nombre: 'Yoleit Fresa', calorias: 115, proteinas: 5, carbohidratos: 19, grasas: 2, categoria: 'merienda' },
  { nombre: 'Yoleit Durazno', calorias: 115, proteinas: 5, carbohidratos: 19, grasas: 2, categoria: 'merienda' },
  { nombre: 'Yoleit Vainilla', calorias: 115, proteinas: 5, carbohidratos: 19, grasas: 2, categoria: 'merienda' },
  { nombre: 'Yoleit Guanábana', calorias: 115, proteinas: 5, carbohidratos: 19, grasas: 2, categoria: 'merienda' },
  { nombre: 'Pura Vida Fresa', calorias: 125, proteinas: 6, carbohidratos: 21, grasas: 2, categoria: 'merienda' },
  { nombre: 'Pura Vida Durazno', calorias: 125, proteinas: 6, carbohidratos: 21, grasas: 2, categoria: 'merienda' },
  { nombre: 'Pura Vida Lúcuma', calorias: 125, proteinas: 6, carbohidratos: 21, grasas: 2, categoria: 'merienda' },
  { nombre: 'Pura Vida Vainilla', calorias: 125, proteinas: 6, carbohidratos: 21, grasas: 2, categoria: 'merienda' },
  
  // Yogurt griego
  { nombre: 'Yogurt griego natural (porción)', calorias: 130, proteinas: 11, carbohidratos: 9, grasas: 5, categoria: 'merienda' },
  { nombre: 'Yogurt griego con fresa', calorias: 150, proteinas: 10, carbohidratos: 18, grasas: 4, categoria: 'merienda' },
  { nombre: 'Yogurt griego con durazno', calorias: 150, proteinas: 10, carbohidratos: 18, grasas: 4, categoria: 'merienda' },
  { nombre: 'Yogurt griego con miel', calorias: 170, proteinas: 10, carbohidratos: 22, grasas: 5, categoria: 'merienda' },
  { nombre: 'Yogurt griego con granola', calorias: 210, proteinas: 12, carbohidratos: 28, grasas: 7, categoria: 'merienda' },
  
  // Café
  { nombre: 'Café negro (taza)', calorias: 5, proteinas: 0, carbohidratos: 1, grasas: 0, categoria: 'merienda' },
  { nombre: 'Cappuccino (vaso grande)', calorias: 150, proteinas: 6, carbohidratos: 18, grasas: 6, categoria: 'merienda' },
  { nombre: 'Latte (vaso grande)', calorias: 180, proteinas: 9, carbohidratos: 20, grasas: 7, categoria: 'merienda' },
  { nombre: 'Frappuccino', calorias: 300, proteinas: 5, carbohidratos: 50, grasas: 10, categoria: 'merienda' },
  { nombre: 'Nescafé (sobre)', calorias: 70, proteinas: 2, carbohidratos: 12, grasas: 2, categoria: 'merienda' },
  
  // Té
  { nombre: 'Té verde (taza)', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  { nombre: 'Té negro (taza)', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, categoria: 'merienda' },
  { nombre: 'Matte (taza)', calorias: 80, proteinas: 2, carbohidratos: 15, grasas: 1, categoria: 'merienda' },
  
  // Comida rápida snacks
  { nombre: 'Empanada de carne', calorias: 280, proteinas: 12, carbohidratos: 30, grasas: 14, categoria: 'merienda' },
  { nombre: 'Empanada de pollo', calorias: 260, proteinas: 14, carbohidratos: 28, grasas: 12, categoria: 'merienda' },
  { nombre: 'Empanada de queso', calorias: 250, proteinas: 10, carbohidratos: 28, grasas: 12, categoria: 'merienda' },
  { nombre: 'Empanada de jamón y queso', calorias: 270, proteinas: 12, carbohidratos: 28, grasas: 13, categoria: 'merienda' },
  { nombre: 'Salchipapa pequeña', calorias: 350, proteinas: 10, carbohidratos: 40, grasas: 16, categoria: 'merienda' },
  { nombre: 'Salchipapa mediana', calorias: 520, proteinas: 14, carbohidratos: 55, grasas: 26, categoria: 'merienda' },
  { nombre: 'Salchipapa grande', calorias: 720, proteinas: 18, carbohidratos: 75, grasas: 36, categoria: 'merienda' },
  { nombre: 'Papas fritas (porción mediana)', calorias: 320, proteinas: 4, carbohidratos: 42, grasas: 15, categoria: 'merienda' },
  { nombre: 'Papas fritas (porción grande)', calorias: 480, proteinas: 6, carbohidratos: 63, grasas: 22, categoria: 'merienda' },
  { nombre: 'Butifarra', calorias: 350, proteinas: 18, carbohidratos: 35, grasas: 16, categoria: 'merienda' },
  { nombre: 'Anticucho (2 palitos)', calorias: 280, proteinas: 24, carbohidratos: 8, grasas: 16, categoria: 'merienda' },
  { nombre: 'Anticucho (3 palitos)', calorias: 420, proteinas: 36, carbohidratos: 12, grasas: 24, categoria: 'merienda' },
  { nombre: 'Rachi (1 palito)', calorias: 180, proteinas: 12, carbohidratos: 6, grasas: 12, categoria: 'merienda' },
  { nombre: 'Chinchulines (1 palito)', calorias: 220, proteinas: 14, carbohidratos: 4, grasas: 16, categoria: 'merienda' },
  { nombre: 'Mollejitas (1 palito)', calorias: 160, proteinas: 15, carbohidratos: 3, grasas: 10, categoria: 'merienda' },
  { nombre: 'Chorizo parrillero', calorias: 320, proteinas: 16, carbohidratos: 4, grasas: 27, categoria: 'merienda' },
  { nombre: 'Picarones (3 unidades)', calorias: 420, proteinas: 5, carbohidratos: 68, grasas: 14, categoria: 'merienda' },
  { nombre: 'Picarones (5 unidades)', calorias: 700, proteinas: 8, carbohidratos: 113, grasas: 23, categoria: 'merienda' },
  { nombre: 'Mazamorra morada (taza)', calorias: 180, proteinas: 2, carbohidratos: 42, grasas: 1, categoria: 'merienda' },
  { nombre: 'Arroz con leche (taza)', calorias: 220, proteinas: 6, carbohidratos: 40, grasas: 5, categoria: 'merienda' },
  { nombre: 'Suspiro limeño (porción)', calorias: 300, proteinas: 5, carbohidratos: 48, grasas: 10, categoria: 'merienda' },
  { nombre: 'Turrón (porción)', calorias: 250, proteinas: 4, carbohidratos: 42, grasas: 8, categoria: 'merienda' },
  { nombre: 'Chancay (1 unidad)', calorias: 140, proteinas: 3, carbohidratos: 26, grasas: 3, categoria: 'merienda' },
  { nombre: 'Pan con relleno', calorias: 200, proteinas: 5, carbohidratos: 32, grasas: 6, categoria: 'merienda' },
  { nombre: 'Pan con chicharrón (porción)', calorias: 420, proteinas: 20, carbohidratos: 32, grasas: 24, categoria: 'merienda' },
  { nombre: 'Pan con pavo', calorias: 280, proteinas: 18, carbohidratos: 32, grasas: 8, categoria: 'merienda' },
  { nombre: 'Triple de pollo', calorias: 380, proteinas: 22, carbohidratos: 38, grasas: 14, categoria: 'merienda' },
  { nombre: 'Triple de jamón', calorias: 350, proteinas: 18, carbohidratos: 40, grasas: 12, categoria: 'merienda' },
  { nombre: 'Tostado con palta', calorias: 220, proteinas: 6, carbohidratos: 28, grasas: 10, categoria: 'merienda' },
  { nombre: 'Tostado con queso', calorias: 240, proteinas: 11, carbohidratos: 26, grasas: 10, categoria: 'merienda' },
  { nombre: 'Tostado mixto', calorias: 280, proteinas: 13, carbohidratos: 28, grasas: 12, categoria: 'merienda' },
  { nombre: 'Hamburguesa simple callejera', calorias: 420, proteinas: 18, carbohidratos: 42, grasas: 20, categoria: 'merienda' },
  { nombre: 'Hot dog callejero', calorias: 320, proteinas: 12, carbohidratos: 35, grasas: 14, categoria: 'merienda' },
  { nombre: 'Choclo con queso', calorias: 280, proteinas: 12, carbohidratos: 38, grasas: 10, categoria: 'merienda' },
  { nombre: 'Tamal peruano (1 unidad)', calorias: 340, proteinas: 12, carbohidratos: 44, grasas: 14, categoria: 'merienda' },
  { nombre: 'Humita (1 unidad)', calorias: 180, proteinas: 5, carbohidratos: 30, grasas: 6, categoria: 'merienda' },
  { nombre: 'Sandwich de pollo', calorias: 380, proteinas: 25, carbohidratos: 38, grasas: 14, categoria: 'merienda' },
  { nombre: 'Sandwich de pavita', calorias: 320, proteinas: 22, carbohidratos: 36, grasas: 9, categoria: 'merienda' },
  
  // Conservas y enlatados (despensa de mamá)
  { nombre: 'Atún en lata Gloria', calorias: 120, proteinas: 25, carbohidratos: 0, grasas: 3, categoria: 'almuerzo' },
  { nombre: 'Sardinas en lata', calorias: 140, proteinas: 18, carbohidratos: 0, grasas: 8, categoria: 'almuerzo' },
  { nombre: 'Paté de hígado (2 cucharadas)', calorias: 90, proteinas: 4, carbohidratos: 2, grasas: 7, categoria: 'merienda' },
  { nombre: 'Durazno en almíbar (2 mitades)', calorias: 110, proteinas: 0, carbohidratos: 28, grasas: 0, categoria: 'merienda' },
  { nombre: 'Leche condensada (2 cucharadas)', calorias: 130, proteinas: 3, carbohidratos: 22, grasas: 3, categoria: 'merienda' },
  { nombre: 'Manjar blanco (2 cucharadas)', calorias: 120, proteinas: 2, carbohidratos: 20, grasas: 4, categoria: 'merienda' },
  { nombre: 'Mermelada Gloria (1 cucharada)', calorias: 50, proteinas: 0, carbohidratos: 13, grasas: 0, categoria: 'merienda' },
];

// Función helper para buscar alimentos
export const buscarAlimentos = (termino) => {
  if (!termino) return ALIMENTOS_DB;
  const busqueda = termino.toLowerCase();
  return ALIMENTOS_DB.filter(alimento => 
    alimento.nombre.toLowerCase().includes(busqueda)
  );
};

// Función para obtener información nutricional de un alimento
export const obtenerInfoNutricional = (nombreAlimento) => {
  return ALIMENTOS_DB.find(alimento => 
    alimento.nombre.toLowerCase() === nombreAlimento.toLowerCase()
  );
};
