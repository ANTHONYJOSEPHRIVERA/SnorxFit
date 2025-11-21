// Carga diferida del CSV completo desde /nutrition.csv y traducción de campos clave al español.

let _cache = null;                // Array de alimentos enriquecidos
let _loadingPromise = null;       // Promesa de carga en curso
let _categories = null;           // Cache de categorías

// Alias manuales adicionales (jerga/local) -> término que aparece en CSV (aprox.)
const manualAliases = {
  'rocoto': 'pepper',
  'cuy': 'guinea',
  'queso helado': 'ice',
  'soltero': 'cheese',
  'adobo': 'pork',
  'chupe': 'shrimp',
  'ocopa': 'sauce',
  'pastel papa': 'potato',
  'tamales': 'corn',
  'tamal': 'corn',
  'malaya': 'beef',
  'pallares': 'beans',
  'leche asada': 'milk',
  'tocino cielo': 'bacon',
  'bizcocho': 'bread',
  'maicillo': 'corn',
  // Nuevos alias básicos de alimentos comunes
  'limon': 'lemon',
  'limón': 'lemon',
  'fresa': 'strawberry',
  'fresas': 'strawberry',
  'manzana': 'apple',
  'platano': 'banana',
  'plátano': 'banana',
  'naranja': 'orange',
  'pera': 'pear',
  'uva': 'grape',
  'uvas': 'grape',
  'queso': 'cheese',
  'pollo': 'chicken',
  'res': 'beef',
  'pescado': 'fish',
  'arroz': 'rice',
  'avena': 'oats',
  'quinoa': 'quinoa',
  'pan': 'bread',
  'brocoli': 'broccoli',
  'brócoli': 'broccoli',
  'zanahoria': 'carrot',
  'pepino': 'cucumber',
  'pimiento': 'pepper',
  'cebolla': 'onion',
  'papa': 'potato',
  'almendras': 'almond',
  'almendra': 'almond',
  'nueces': 'walnut',
  'nuez': 'walnut'
};

// Traducciones directas de nombres (lowercase exact) -> español
const nameTranslation = {
  'apple': 'Manzana',
  'banana': 'Plátano',
  'strawberry': 'Fresa',
  'strawberries': 'Fresas',
  'lemon': 'Limón',
  'lime': 'Lima',
  'orange': 'Naranja',
  'grape': 'Uva',
  'grapes': 'Uvas',
  'pear': 'Pera',
  'peach': 'Durazno',
  'watermelon': 'Sandía',
  'melon': 'Melón',
  'pineapple': 'Piña',
  'mango': 'Mango',
  'papaya': 'Papaya',
  'broccoli': 'Brócoli',
  'carrot': 'Zanahoria',
  'spinach': 'Espinaca',
  'lettuce': 'Lechuga',
  'cabbage': 'Repollo',
  'tomato': 'Tomate',
  'cucumber': 'Pepino',
  'pepper': 'Pimiento',
  'onion': 'Cebolla',
  'garlic': 'Ajo',
  'potato': 'Papa',
  'sweet_potato': 'Camote',
  'chicken': 'Pollo',
  'beef': 'Carne de Res',
  'pork': 'Cerdo',
  'fish': 'Pescado',
  'salmon': 'Salmón',
  'tuna': 'Atún',
  'shrimp': 'Camarón',
  'egg': 'Huevo',
  'eggs': 'Huevos',
  'milk': 'Leche',
  'yogurt': 'Yogur',
  'cheese': 'Queso',
  'butter': 'Mantequilla',
  'rice': 'Arroz',
  'brown_rice': 'Arroz Integral',
  'oats': 'Avena',
  'quinoa': 'Quinoa',
  'bread': 'Pan',
  'almond': 'Almendra',
  'almonds': 'Almendras',
  'walnut': 'Nuez',
  'walnuts': 'Nueces',
  'peanut': 'Maní',
  'peanuts': 'Maní',
  'chia': 'Chía',
  'chia_seed': 'Semilla de Chía',
  'chia_seeds': 'Semillas de Chía',
  'avocado': 'Aguacate'
};

// Clasificación heurística por patrones (lowercase substring)
const categoryMatchers = [
  { id: 'frutas', label: 'Frutas', patterns: ['apple','banana','straw','lemon','lime','orange','grape','pear','peach','watermelon','melon','pineapple','mango','papaya','avocado'] },
  { id: 'verduras', label: 'Verduras', patterns: ['broccoli','carrot','spinach','lettuce','cabbage','tomato','cucumber','pepper','onion','garlic','potato','sweet'] },
  { id: 'proteinas', label: 'Proteínas', patterns: ['chicken','beef','pork','fish','salmon','tuna','shrimp','egg'] },
  { id: 'lacteos', label: 'Lácteos', patterns: ['milk','yogurt','cheese','butter'] },
  { id: 'granos', label: 'Granos / Cereales', patterns: ['rice','oats','quinoa','bread','corn','wheat'] },
  { id: 'frutos_secos', label: 'Frutos Secos y Semillas', patterns: ['almond','walnut','peanut','chia','seed','almendra','nuez'] }
];

const normalize = (s='') => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9\s]/g,'');

const headerMapEs = {
  name: 'nombre',
  serving_size: 'porcion',
  calories: 'calorias',
  total_fat: 'grasa_total',
  saturated_fat: 'grasa_saturada',
  cholesterol: 'colesterol',
  sodium: 'sodio',
  protein: 'proteina',
  carbohydrate: 'carbohidratos',
  fiber: 'fibra',
  sugars: 'azucares'
};

const toKey = (raw) => {
  if (!raw) return 'id';
  return raw.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/_{2,}/g, '_').replace(/^_|_$/g, '');
};

const parseNumeric = (val) => {
  if (val == null) return null;
  const cleaned = String(val)
    .replace(/,/g, '.')
    .replace(/\b(grams?|mg|mcg|iu|g)\b/gi, '')
    .replace(/[^0-9.+-]/g, '')
    .trim();
  if (cleaned === '' || cleaned === '.') return null;
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? null : num;
};

const parseCSV = (csv) => {
  const lines = csv.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length < 2) return [];
  const rawHeaders = lines[0].split(';');
  const headers = rawHeaders.map(toKey);
  const rows = lines.slice(1).map(line => {
    const cols = line.split(';');
    const row = {};
    headers.forEach((h, i) => {
      const value = cols[i] ?? '';
      if (h === 'id') { row.id = parseInt(value, 10); return; }
      if (h === 'name') { row.nombre = value.trim(); return; }
      if (h === 'serving_size') { row.porcion = value.trim(); return; }
      const numeric = parseNumeric(value);
      const mapped = headerMapEs[h] || h;
      row[mapped] = numeric != null ? numeric : (value === '' ? null : value);
    });
    row.calorias = row.calorias ?? row.calories ?? null;
    row.grasa_total = row.grasa_total ?? row.total_fat ?? row.fat ?? null;
    row.carbohidratos = row.carbohidratos ?? row.carbohydrate ?? null;
    row.proteina = row.proteina ?? row.protein ?? null;
    return row;
  });
  return rows;
};

// Enriquecer filas: traducción, alias y categoría
const enrichRows = (rows) => {
  rows.forEach(r => {
    const base = (r.nombre || '').trim();
    const lower = base.toLowerCase();
    // nombre_es exacto si hay traducción directa
    r.nombre_es = nameTranslation[lower] || base; // fallback al nombre original (en inglés) si no se conoce
    // alias inicial (sin acentos + pluralización simple)
    const norm = normalize(r.nombre_es);
    const aliases = new Set();
    aliases.add(norm);
    // Plural español simple
    if (!norm.endsWith('s')) aliases.add(norm + 's');
    // Añadir versiones sin y con acento para palabras comunes
    if (norm.includes('platano')) aliases.add('plátano');
    if (norm.includes('brocoli')) aliases.add('brócoli');
    if (norm.includes('limon')) aliases.add('limón');
    if (norm.includes('fresa')) aliases.add('fresas');
    // Mapear alias manuales inversos (es->en) si coincide
    Object.entries(manualAliases).forEach(([es, en]) => {
      if (en && lower.includes(en)) aliases.add(es);
    });
    r.aliases = Array.from(aliases);

    // Categoría heurística
    const foundCat = categoryMatchers.find(cat => cat.patterns.some(p => lower.includes(p)));
    r.categoria = foundCat ? foundCat.id : 'otros';
  });

  // Construir estructura de categorías
  const grouped = {};
  rows.forEach(r => {
    grouped[r.categoria] = grouped[r.categoria] || [];
    grouped[r.categoria].push(r);
  });
  _categories = Object.keys(grouped).map(id => {
    const meta = categoryMatchers.find(c => c.id === id);
    return {
      id,
      nombre: meta?.label || id,
      total: grouped[id].length,
      items: grouped[id]
    };
  });
  return rows;
};

export const loadNutritionIndex = async () => {
  if (_cache) return _cache;
  if (_loadingPromise) return _loadingPromise;
  const tryPaths = ['/nutrition.csv','/informacion_nutricional/nutrition.csv'];
  _loadingPromise = (async () => {
    let text = null;
    for (const p of tryPaths) {
      try {
        const r = await fetch(p);
        if (r.ok) { text = await r.text(); break; }
      } catch {/* ignore */}
    }
    if (!text) throw new Error('No se pudo cargar nutrition.csv en rutas previstas');
    const rows = parseCSV(text);
    _cache = enrichRows(rows);
    return _cache;
  })().finally(()=>{ _loadingPromise = null; });
  return _loadingPromise;
};

export const findFoods = async (query, limit = 25, { categoria } = {}) => {
  const raw = query.trim();
  const q = normalize(raw);
  if (!q && !categoria) return [];
  const data = await loadNutritionIndex();

  let pool = data;
  if (categoria) pool = pool.filter(f => f.categoria === categoria);

  // Ranking simple: nombre_es > nombre > alias
  const scored = [];
  for (const f of pool) {
    const n1 = f.nombre ? normalize(f.nombre) : '';
    const n2 = f.nombre_es ? normalize(f.nombre_es) : n1;
    const aliasHit = f.aliases?.some(a => a.includes(q));
    const matchNombreEs = q && n2.includes(q);
    const matchNombre = q && n1.includes(q);
    if (!q || matchNombreEs || matchNombre || aliasHit) {
      let score = 0;
      if (matchNombreEs) score += 30;
      if (matchNombre) score += 20;
      if (aliasHit) score += 10;
      // Más corto => más relevante
      score += Math.max(0, 10 - (f.nombre_es?.length || f.nombre?.length || 50)/10);
      scored.push({ f, score });
    }
  }
  scored.sort((a,b)=> b.score - a.score);
  return scored.slice(0, limit).map(s => s.f);
};

export const listCategories = async () => {
  if (!_cache) await loadNutritionIndex();
  return _categories || [];
};

export default { loadNutritionIndex, findFoods, listCategories };
