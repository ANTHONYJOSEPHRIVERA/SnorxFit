export const foodCategories = [
  {
    id: 'fruits',
    name: 'Frutas',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a537cd85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    items: [
      { id: 'apple', name: 'Manzana', icon: '🍎', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
      { id: 'banana', name: 'Plátano', icon: '🍌', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
      { id: 'orange', name: 'Naranja', icon: '🍊', calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
      { id: 'grapes', name: 'Uvas', icon: '🍇', calories: 69, protein: 0.6, carbs: 18, fat: 0.2 },
      { id: 'strawberry', name: 'Fresa', icon: '🍓', calories: 32, protein: 0.7, carbs: 8, fat: 0.3 },
      { id: 'pineapple', name: 'Piña', icon: '🍍', calories: 50, protein: 0.5, carbs: 13, fat: 0.1 },
      { id: 'mango', name: 'Mango', icon: '🥭', calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
      { id: 'watermelon', name: 'Sandía', icon: '🍉', calories: 30, protein: 0.6, carbs: 8, fat: 0.2 },
      { id: 'papaya', name: 'Papaya', icon: '🥭', calories: 43, protein: 0.5, carbs: 11, fat: 0.1 },
      { id: 'lucuma', name: 'Lúcuma', aliases: ['lucma'], icon: '🥭', calories: 99, protein: 1.5, carbs: 25, fat: 0.2 },
      { id: 'chirimoya', name: 'Chirimoya', icon: '🍏', calories: 75, protein: 1.6, carbs: 18, fat: 0.7 },
      { id: 'granadilla', name: 'Granadilla', icon: '🥝', calories: 97, protein: 2.2, carbs: 23, fat: 0.7 },
      { id: 'tuna', name: 'Tuna (fruta)', aliases: ['higo'], icon: '🍐', calories: 41, protein: 0.7, carbs: 10, fat: 0.5 },
      { id: 'aguaymanto', name: 'Aguaymanto', aliases: ['capulí'], icon: '🫐', calories: 53, protein: 1.9, carbs: 11, fat: 0.7 },
      { id: 'maracuya', name: 'Maracuyá', aliases: ['parchita'], icon: '🥝', calories: 97, protein: 2.2, carbs: 23, fat: 0.7 }
    ]
  },
  {
    id: 'vegetables',
    name: 'Verduras',
    image: 'https://images.unsplash.com/photo-1518843875455-f7ce8b07969b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    items: [
      { id: 'broccoli', name: 'Brócoli', icon: '🥦', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
      { id: 'carrot', name: 'Zanahoria', icon: '🥕', calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
      { id: 'spinach', name: 'Espinaca', icon: '🥬', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
      { id: 'tomato', name: 'Tomate', icon: '🍅', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
      { id: 'cucumber', name: 'Pepino', icon: '🥒', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },
      { id: 'pepper', name: 'Pimiento', icon: '🌶️', calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2 },
      { id: 'onion', name: 'Cebolla', icon: '🧅', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },
      { id: 'potato', name: 'Papa', icon: '🥔', calories: 77, protein: 2, carbs: 17, fat: 0.1 },
      { id: 'sweetPotato', name: 'Camote', aliases: ['batata'], icon: '🍠', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
      { id: 'yuca', name: 'Yuca', aliases: ['mandioca'], icon: '🥔', calories: 160, protein: 1.4, carbs: 38, fat: 0.3 },
      { id: 'choclo', name: 'Choclo', aliases: ['maíz','elote'], icon: '🌽', calories: 86, protein: 3.3, carbs: 19, fat: 1.4 },
      { id: 'lechuga', name: 'Lechuga', icon: '🥬', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
      { id: 'betarraga', name: 'Betarraga', aliases: ['beterraga','remolacha'], icon: '🫐', calories: 43, protein: 1.6, carbs: 9.6, fat: 0.2 },
      { id: 'rocoto', name: 'Rocoto', icon: '🌶️', calories: 30, protein: 1.5, carbs: 6.7, fat: 0.4 },
      { id: 'aji', name: 'Ají amarillo', aliases: ['aji amarillo'], icon: '🌶️', calories: 35, protein: 1.8, carbs: 7.2, fat: 0.5 }
    ]
  },
  {
    id: 'legumes',
    name: 'Legumbres',
    image: 'https://images.unsplash.com/photo-1556910110-a56617908b73?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    items: [
      { id: 'lentils', name: 'Lentejas', icon: '🍲', calories: 116, protein: 9, carbs: 20, fat: 0.4 },
      { id: 'chickpeas', name: 'Garbanzos', icon: '🫘', calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
      { id: 'beans', name: 'Frijoles', icon: '🫘', calories: 127, protein: 7.8, carbs: 23, fat: 0.5 },
      { id: 'peas', name: 'Guisantes', icon: '🫛', calories: 81, protein: 5.4, carbs: 14, fat: 0.4 }
    ]
  },
  {
    id: 'meats',
    name: 'Carnes',
    image: 'https://images.unsplash.com/photo-1603048297172-c92552a7f755?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    items: [
      { id: 'chicken', name: 'Pollo (pechuga)', aliases: ['pechuga de pollo'], icon: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      { id: 'chickenThigh', name: 'Pollo (pierna)', aliases: ['pierna de pollo'], icon: '🍗', calories: 209, protein: 26, carbs: 0, fat: 11 },
      { id: 'beef', name: 'Res (magra)', aliases: ['carne de res'], icon: '🥩', calories: 250, protein: 26, carbs: 0, fat: 15 },
      { id: 'pork', name: 'Cerdo (lomo)', aliases: ['chancho'], icon: '🍖', calories: 242, protein: 26, carbs: 0, fat: 14 },
      { id: 'fish', name: 'Pescado (salmón)', icon: '🐟', calories: 208, protein: 20, carbs: 0, fat: 13 },
      { id: 'bonito', name: 'Bonito', icon: '🐟', calories: 144, protein: 23, carbs: 0, fat: 5 },
      { id: 'jurel', name: 'Jurel', icon: '🐟', calories: 159, protein: 26, carbs: 0, fat: 5.5 },
      { id: 'camarones', name: 'Camarones', aliases: ['langostino'], icon: '🦐', calories: 85, protein: 18, carbs: 1, fat: 1.2 },
      { id: 'chorizo', name: 'Chorizo', icon: '🌭', calories: 455, protein: 24, carbs: 2, fat: 38 },
      { id: 'hotdog', name: 'Hot Dog', aliases: ['vienesa','salchicha'], icon: '🌭', calories: 290, protein: 10, carbs: 2, fat: 26 },
      { id: 'anticuchos', name: 'Anticuchos (corazón)', aliases: ['anticucho'], icon: '串', calories: 250, protein: 28, carbs: 5, fat: 12 },
      { id: 'higado', name: 'Hígado de res', aliases: ['higado'], icon: '🥩', calories: 135, protein: 20, carbs: 4, fat: 4 }
    ]
  },
  {
    id: 'dairy',
    name: 'Lácteos y Alternativas',
    image: 'https://images.unsplash.com/photo-1628088974940-22010009507a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    items: [
      { id: 'milk', name: 'Leche', icon: '🥛', calories: 42, protein: 3.4, carbs: 5, fat: 1 },
      { id: 'yogurt', name: 'Yogur Griego', icon: '🍦', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
      { id: 'cheese', name: 'Queso', icon: '🧀', calories: 402, protein: 25, carbs: 1.3, fat: 33 },
      { id: 'almondMilk', name: 'Leche de Almendras', icon: '🥛', calories: 15, protein: 0.6, carbs: 1.4, fat: 1.1 }
    ]
  },
  {
    id: 'grains',
    name: 'Granos y Cereales',
    image: 'https://images.unsplash.com/photo-1585237507186-d32700102108?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    items: [
      { id: 'rice', name: 'Arroz Integral', icon: '🍚', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
      { id: 'oats', name: 'Avena', icon: '🥣', calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
      { id: 'quinoa', name: 'Quinoa', icon: '🌾', calories: 120, protein: 4.4, carbs: 21, fat: 1.9 },
      { id: 'bread', name: 'Pan Integral', icon: '🍞', calories: 265, protein: 13, carbs: 49, fat: 3.3 }
    ]
  },
  {
    id: 'nutsSeeds',
    name: 'Frutos Secos y Semillas',
    image: 'https://images.unsplash.com/photo-1562911791-d23605707070?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    items: [
      { id: 'almonds', name: 'Almendras', icon: '🌰', calories: 579, protein: 21, carbs: 22, fat: 49 },
      { id: 'walnuts', name: 'Nueces', icon: '🌰', calories: 654, protein: 15, carbs: 14, fat: 65 },
      { id: 'chiaSeeds', name: 'Semillas de Chía', icon: '🌱', calories: 486, protein: 17, carbs: 42, fat: 31 },
      { id: 'avocado', name: 'Aguacate', icon: '🥑', calories: 160, protein: 2, carbs: 9, fat: 15 }
    ]
  },
  {
    id: 'peruvianDishes',
    name: 'Comidas Peruanas Populares',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    items: [
      { id: 'ceviche', name: 'Ceviche', aliases: ['sebiche'], tags: ['mariscos','entrada'], icon: '🐟', calories: 250, protein: 35, carbs: 20, fat: 4 },
      { id: 'lomoSaltado', name: 'Lomo Saltado', aliases: ['lomo','saltado'], tags: ['fondo','carne'], icon: '🍖', calories: 550, protein: 30, carbs: 45, fat: 28 },
      { id: 'ajiDeGallina', name: 'Ají de Gallina', aliases: ['aji gallina'], tags: ['fondo','pollo'], icon: '🍗', calories: 600, protein: 28, carbs: 40, fat: 35 },
      { id: 'polloBrasa', name: 'Pollo a la Brasa (1/4)', aliases: ['pollo brasa','pollo a la brasa'], tags: ['fondo','pollo'], icon: '🍗', calories: 450, protein: 40, carbs: 15, fat: 25 },
      { id: 'arrozConPollo', name: 'Arroz con Pollo', aliases: ['arroz pollo'], tags: ['fondo'], icon: '🍚', calories: 520, protein: 32, carbs: 58, fat: 18 },
      { id: 'causaLimena', name: 'Causa Limeña', aliases: ['causa'], tags: ['entrada'], icon: '🥔', calories: 380, protein: 12, carbs: 42, fat: 18 },
      { id: 'papaRellena', name: 'Papa Rellena', aliases: ['papa'], tags: ['snack','frito'], icon: '🥔', calories: 420, protein: 15, carbs: 48, fat: 20 },
      { id: 'tallarinSaltado', name: 'Tallarín Saltado', aliases: ['tallarin','saltado fideos'], tags: ['fondo','fideos'], icon: '🍝', calories: 580, protein: 28, carbs: 62, fat: 24 },
      { id: 'tallarinVerde', name: 'Tallarín Verde', aliases: ['tallarin verde'], tags: ['fondo','fideos'], icon: '🍝', calories: 620, protein: 22, carbs: 68, fat: 28 },
      { id: 'carapulcra', name: 'Carapulcra', aliases: ['carapulca'], tags: ['fondo'], icon: '🍲', calories: 650, protein: 35, carbs: 55, fat: 32 },
      { id: 'sancochado', name: 'Sancochado', aliases: ['puchero'], tags: ['sopa','caldo'], icon: '🍲', calories: 480, protein: 30, carbs: 42, fat: 20 },
      { id: 'aguadito', name: 'Aguadito de Pollo', aliases: ['aguadito'], tags: ['sopa'], icon: '🍜', calories: 320, protein: 22, carbs: 35, fat: 10 },
      { id: 'chaufa', name: 'Arroz Chaufa', aliases: ['chaufa','arroz chaufa'], tags: ['fondo','chifa'], icon: '🍚', calories: 640, protein: 18, carbs: 78, fat: 28 },
      { id: 'wantan', name: 'Wantán Frito', aliases: ['wantan'], tags: ['entrada','chifa'], icon: '🥟', calories: 380, protein: 14, carbs: 32, fat: 22 },
      { id: 'aeropuerto', name: 'Aeropuerto', aliases: ['aero puerto'], tags: ['fondo','chifa'], icon: '🍜', calories: 680, protein: 22, carbs: 82, fat: 30 },
      { id: 'tacu tacu', name: 'Tacu Tacu', aliases: ['tacutacu'], tags: ['fondo'], icon: '🍚', calories: 550, protein: 20, carbs: 62, fat: 24 },
      { id: 'arroz-frijoles', name: 'Arroz con Frijoles', aliases: ['arroz frijol','menestra'], icon: '🍚', calories: 380, protein: 12, carbs: 58, fat: 10 },
      { id: 'chicharron', name: 'Chicharrón de Cerdo', aliases: ['chicharron'], tags: ['fondo','carne'], icon: '🍖', calories: 720, protein: 42, carbs: 8, fat: 58 },
      { id: 'chicharronPollo', name: 'Chicharrón de Pollo', aliases: ['chicha pollo'], tags: ['fondo','pollo'], icon: '🍗', calories: 580, protein: 38, carbs: 35, fat: 32 },
      { id: 'milanesa', name: 'Milanesa', aliases: ['apanado'], tags: ['fondo','carne'], icon: '🥩', calories: 520, protein: 32, carbs: 38, fat: 26 },
      { id: 'bisteck', name: 'Bisteck a lo Pobre', aliases: ['bistec','pobre'], tags: ['fondo','carne'], icon: '🥩', calories: 780, protein: 45, carbs: 62, fat: 38 },
      { id: 'salchipapas', name: 'Salchipapas', aliases: ['salchi'], tags: ['snack','callejera'], icon: '🌭', calories: 650, protein: 18, carbs: 72, fat: 32 },
      { id: 'hamburguesa', name: 'Hamburguesa Simple', aliases: ['burger'], tags: ['snack'], icon: '🍔', calories: 540, protein: 28, carbs: 48, fat: 26 },
      { id: 'butifarra', name: 'Butifarra', aliases: ['sandwich jamon'], tags: ['snack','sandwich'], icon: '🥪', calories: 480, protein: 22, carbs: 52, fat: 20 },
      { id: 'pan-palta', name: 'Pan con Palta', aliases: ['palta'], tags: ['desayuno','snack'], icon: '🥑', calories: 320, protein: 8, carbs: 42, fat: 14 },
      { id: 'pan-huevo', name: 'Pan con Huevo', aliases: ['huevo frito'], tags: ['desayuno'], icon: '🍳', calories: 380, protein: 14, carbs: 42, fat: 16 },
      { id: 'tamales', name: 'Tamal', aliases: ['tamale'], tags: ['desayuno'], icon: '🌽', calories: 340, protein: 12, carbs: 44, fat: 14 },
      { id: 'empanada', name: 'Empanada de Carne', aliases: ['empanadita'], tags: ['snack'], icon: '🥟', calories: 320, protein: 14, carbs: 38, fat: 14 },
      { id: 'picarones', name: 'Picarones', aliases: ['picaron'], tags: ['postre','callejera'], icon: '🍩', calories: 420, protein: 5, carbs: 68, fat: 14 },
      { id: 'mazamorra-morada', name: 'Mazamorra Morada', aliases: ['mazamorra'], tags: ['postre'], icon: '🍮', calories: 180, protein: 2, carbs: 42, fat: 1 },
      { id: 'arroz-leche', name: 'Arroz con Leche', aliases: ['arroz leche'], tags: ['postre'], icon: '🍚', calories: 290, protein: 8, carbs: 52, fat: 6 }
    ]
  },
  {
    id: 'breakfast',
    name: 'Desayunos Peruanos',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=2070&auto=format&fit=crop',
    items: [
      { id: 'quinua-leche', name: 'Quinua con Leche', aliases: ['quinoa'], tags: ['desayuno'], icon: '🥣', calories: 210, protein: 8, carbs: 36, fat: 4 },
      { id: 'avena', name: 'Avena con Leche', aliases: ['avena leche'], tags: ['desayuno'], icon: '🥣', calories: 180, protein: 6, carbs: 32, fat: 3 },
      { id: 'pan-queso', name: 'Pan con Queso', aliases: ['pan con queso'], tags: ['desayuno'], icon: '🧀', calories: 380, protein: 16, carbs: 42, fat: 16 },
      { id: 'pan-mantequilla', name: 'Pan con Mantequilla', aliases: ['pan mantequilla'], tags: ['desayuno'], icon: '🧈', calories: 280, protein: 6, carbs: 42, fat: 10 },
      { id: 'pan-mermelada', name: 'Pan con Mermelada', aliases: ['pan mermelada'], tags: ['desayuno'], icon: '🍓', calories: 260, protein: 5, carbs: 52, fat: 3 },
      { id: 'cafe-leche', name: 'Café con Leche', aliases: ['cafe'], tags: ['bebida'], icon: '☕', calories: 90, protein: 4, carbs: 10, fat: 3 },
      { id: 'te', name: 'Té', tags: ['bebida'], icon: '🍵', calories: 2, protein: 0, carbs: 0.5, fat: 0 },
      { id: 'emoliente', name: 'Emoliente', tags: ['bebida','tradicional'], icon: '🍵', calories: 45, protein: 0.5, carbs: 11, fat: 0.2 },
      { id: 'chicha-morada-desayuno', name: 'Chicha Morada (vaso)', aliases: ['chicha'], tags: ['bebida'], icon: '🥤', calories: 120, protein: 1, carbs: 30, fat: 0.5 },
      { id: 'jugo-naranja', name: 'Jugo de Naranja', aliases: ['jugo'], tags: ['bebida'], icon: '🍊', calories: 110, protein: 1.7, carbs: 26, fat: 0.5 },
      { id: 'jugo-papaya', name: 'Jugo de Papaya', tags: ['bebida'], icon: '🥭', calories: 95, protein: 1.2, carbs: 24, fat: 0.3 }
    ]
  },
  {
    id: 'snacks',
    name: 'Snacks y Piqueos Peruanos',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=2070&auto=format&fit=crop',
    items: [
      { id: 'cancha', name: 'Cancha Serrana', aliases: ['cancha','maíz tostado'], tags: ['snack'], icon: '🌽', calories: 120, protein: 4, carbs: 22, fat: 2 },
      { id: 'chifles', name: 'Chifles', aliases: ['platano frito'], tags: ['snack'], icon: '🍌', calories: 280, protein: 2, carbs: 38, fat: 14 },
      { id: 'yucas-fritas', name: 'Yucas Fritas', aliases: ['yuca frita'], tags: ['acompañamiento'], icon: '🍟', calories: 320, protein: 2.5, carbs: 52, fat: 12 },
      { id: 'papas-fritas', name: 'Papas Fritas', aliases: ['papa frita'], tags: ['acompañamiento'], icon: '🍟', calories: 365, protein: 4, carbs: 48, fat: 18 },
      { id: 'camote-frito', name: 'Camote Frito', aliases: ['camote'], tags: ['acompañamiento'], icon: '🍠', calories: 290, protein: 2.8, carbs: 42, fat: 12 },
      { id: 'tostada', name: 'Tostada con Mantequilla', aliases: ['tostadas'], tags: ['snack'], icon: '🍞', calories: 180, protein: 4, carbs: 28, fat: 6 },
      { id: 'galletas-soda', name: 'Galletas de Soda (6 und)', aliases: ['galleta','soda'], tags: ['snack'], icon: '🍪', calories: 120, protein: 2.5, carbs: 20, fat: 3.5 },
      { id: 'galletas-dulces', name: 'Galletas Dulces (4 und)', aliases: ['galleta dulce'], tags: ['snack'], icon: '🍪', calories: 180, protein: 2, carbs: 28, fat: 7 },
      { id: 'chancay', name: 'Chancay', tags: ['snack'], icon: '🍞', calories: 210, protein: 4, carbs: 36, fat: 6 },
      { id: 'bizcocho', name: 'Bizcocho', tags: ['snack'], icon: '🍰', calories: 320, protein: 5, carbs: 48, fat: 12 },
      { id: 'alfajor', name: 'Alfajor', tags: ['snack','postre'], icon: '🍪', calories: 280, protein: 3, carbs: 42, fat: 11 },
      { id: 'chocotejas', name: 'Chocotejas', aliases: ['teja'], tags: ['snack','dulce'], icon: '🍫', calories: 150, protein: 2.5, carbs: 18, fat: 8 }
    ]
  },
  {
    id: 'drinks',
    name: 'Bebidas Peruanas',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=2070&auto=format&fit=crop',
    items: [
      { id: 'inca-kola', name: 'Inca Kola (500ml)', aliases: ['incakola'], tags: ['gaseosa'], icon: '🥤', calories: 230, protein: 0, carbs: 58, fat: 0 },
      { id: 'coca-cola', name: 'Coca Cola (500ml)', aliases: ['coca','cola'], tags: ['gaseosa'], icon: '🥤', calories: 210, protein: 0, carbs: 55, fat: 0 },
      { id: 'coca-zero', name: 'Coca Cola Zero (500ml)', aliases: ['coca zero','coke zero'], tags: ['gaseosa'], icon: '🥤', calories: 0, protein: 0, carbs: 0, fat: 0 },
      { id: 'sprite', name: 'Sprite (500ml)', tags: ['gaseosa'], icon: '🥤', calories: 200, protein: 0, carbs: 52, fat: 0 },
      { id: 'fanta', name: 'Fanta (500ml)', tags: ['gaseosa'], icon: '🥤', calories: 220, protein: 0, carbs: 56, fat: 0 },
      { id: 'guarana', name: 'Guaraná (500ml)', tags: ['gaseosa'], icon: '🥤', calories: 210, protein: 0, carbs: 54, fat: 0 },
      { id: 'agua', name: 'Agua (500ml)', tags: ['bebida'], icon: '💧', calories: 0, protein: 0, carbs: 0, fat: 0 },
      { id: 'chicha-jora', name: 'Chicha de Jora', aliases: ['chicha jora'], tags: ['tradicional'], icon: '🥤', calories: 180, protein: 2, carbs: 42, fat: 1 },
      { id: 'cremolada', name: 'Cremolada', aliases: ['raspadilla'], tags: ['helado'], icon: '🍧', calories: 150, protein: 0.5, carbs: 38, fat: 0 },
      { id: 'pisco-sour', name: 'Pisco Sour', aliases: ['pisco'], tags: ['cocktail','alcohol'], icon: '🍹', calories: 220, protein: 1, carbs: 18, fat: 0.5 }
    ]
  },
  {
    id: 'arequipaDishes',
    name: 'Platos Típicos de Arequipa',
    image: 'https://images.unsplash.com/photo-1622734000000-000000000000?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder image
    items: [
      { id: 'rocotoRelleno', name: 'Rocoto Relleno', aliases: ['rocoto'], tags: ['fondo','picante'], icon: '🌶️', calories: 450, protein: 25, carbs: 30, fat: 25 },
      { id: 'adoboArequipeno', name: 'Adobo Arequipeño', aliases: ['adobo'], tags: ['fondo','carne'], icon: '🍲', calories: 600, protein: 40, carbs: 35, fat: 35 },
      { id: 'solteroDeQueso', name: 'Soltero de Queso', aliases: ['soltero'], tags: ['entrada','ensalada'], icon: '🥗', calories: 300, protein: 15, carbs: 20, fat: 18 },
      { id: 'chupeDeCamarones', name: 'Chupe de Camarones', aliases: ['chupe'], tags: ['sopa','mariscos'], icon: '🦐', calories: 550, protein: 30, carbs: 40, fat: 28 },
      { id: 'ocopaArequipena', name: 'Ocopa Arequipeña', aliases: ['ocopa'], tags: ['entrada','salsa'], icon: '🥬', calories: 380, protein: 10, carbs: 22, fat: 28 },
      { id: 'cuyChactado', name: 'Cuy Chactado', aliases: ['cuy'], tags: ['fondo','carne'], icon: '🐹', calories: 620, protein: 55, carbs: 15, fat: 35 },
      { id: 'costillarFrito', name: 'Costillar Frito', aliases: ['costillar', 'costillar dorado'], tags: ['fondo','carne'], icon: '🍖', calories: 670, protein: 42, carbs: 18, fat: 45 },
      { id: 'pastelDePapa', name: 'Pastel de Papa', aliases: ['pastel papa'], tags: ['acompanamiento','horneado'], icon: '🥔', calories: 420, protein: 12, carbs: 48, fat: 20 },
      { id: 'chaqueDeTripas', name: 'Chaque de Tripas', aliases: ['chaque'], tags: ['sopa','caldo'], icon: '🍲', calories: 510, protein: 32, carbs: 38, fat: 26 },
      { id: 'caucheDeQueso', name: 'Cauche de Queso', aliases: ['cauche', 'cauchi'], tags: ['fondo','queso'], icon: '🧀', calories: 460, protein: 22, carbs: 25, fat: 30 },
      { id: 'malayaFrita', name: 'Malaya Frita', aliases: ['malaya'], tags: ['fondo','carne'], icon: '🥩', calories: 560, protein: 38, carbs: 6, fat: 42 },
      { id: 'ensaladaDePallares', name: 'Ensalada de Pallares', aliases: ['pallares'], tags: ['ensalada','entrada'], icon: '🫘', calories: 290, protein: 16, carbs: 32, fat: 8 },
      { id: 'tamalesArequipenos', name: 'Tamales Arequipeños', aliases: ['tamales', 'tamal'], tags: ['desayuno','snack'], icon: '🌽', calories: 340, protein: 12, carbs: 44, fat: 14 },
      { id: 'copaDeCamarones', name: 'Copa de Camarones', aliases: ['copa camarones'], tags: ['entrada','mariscos'], icon: '🍤', calories: 420, protein: 28, carbs: 18, fat: 26 },
      { id: 'americanoArequipeno', name: 'Americano Arequipeño', aliases: ['americano'], tags: ['desayuno'], icon: '🥪', calories: 480, protein: 22, carbs: 46, fat: 22 }
    ]
  },
  {
    id: 'arequipaDesserts',
    name: 'Postres Típicos de Arequipa',
    image: 'https://images.unsplash.com/photo-1622734000000-000000000000?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder image
    items: [
      { id: 'quesoHelado', name: 'Queso Helado', aliases: ['helado de queso'], tags: ['postre','frio'], icon: '🍦', calories: 250, protein: 5, carbs: 40, fat: 8 },
      { id: 'bunuelos', name: 'Buñuelos', aliases: ['buñuelo'], tags: ['postre','frito'], icon: '🍩', calories: 350, protein: 4, carbs: 50, fat: 15 },
      { id: 'chichaMorada', name: 'Chicha Morada', aliases: ['chicha'], tags: ['bebida'], icon: '🥤', calories: 120, protein: 1, carbs: 30, fat: 0.5 },
      { id: 'lecheAsada', name: 'Leche Asada', aliases: ['leche asá'], tags: ['postre','horneado'], icon: '🥮', calories: 310, protein: 10, carbs: 42, fat: 12 },
      { id: 'tocinoDelCielo', name: 'Tocino del Cielo', aliases: ['tocino cielo'], tags: ['postre'], icon: '🍮', calories: 420, protein: 8, carbs: 55, fat: 18 },
      { id: 'bizcochoArequipeno', name: 'Bizcocho Arequipeño', aliases: ['bizcocho'], tags: ['postre','horneado'], icon: '🍰', calories: 360, protein: 6, carbs: 52, fat: 14 },
      { id: 'maicillo', name: 'Maicillo', aliases: ['maicillos'], tags: ['postre','galleta'], icon: '🍪', calories: 300, protein: 5, carbs: 48, fat: 10 }
    ]
  }
];