import React, { useEffect, useState } from 'react';
// import { photoApi } from '../services/apiService'; // REMOVIDO - Migrado a Firebase
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Upload, X, Trash2, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PhotoGallery = () => {
  const { isOnline } = useAuth();
  const toast = useToast();
  const [photos, setPhotos] = useState([]);
  const [type, setType] = useState('progress');
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    if (isOnline) {
      // TODO: Cargar desde Firebase Storage
      // const res = await photoApi.list(type);
      const res = { success: false };
      if (res.success) setPhotos(res.data.data || res.data || []);
    }
  };

  useEffect(()=> { load(); }, [type, isOnline]);

  const submit = async (e) => {
    e.preventDefault();
  if (!file) return;
  if (!/^image\/(jpeg|png|jpg|webp)$/i.test(file.type)) { toast.error('Formato no permitido'); return; }
  if (file.size > 2*1024*1024) { toast.error('Máx 2MB'); return; }
    setUploading(true);
    const opt = { type, caption, takenAt: new Date().toISOString().substring(0,10) };
    // TODO: Subir a Firebase Storage
    // const res = await photoApi.upload(file, opt);
    const res = { success: false };
    setUploading(false);
    if (res.success) {
      setShowUpload(false); setFile(null); setCaption(''); load();
      toast.success('Foto subida');
    } else {
      toast.error(res.error || 'Error subiendo');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar foto?')) return;
    // TODO: Eliminar de Firebase Storage
    // if (isOnline) await photoApi.remove(id);
    setPhotos(prev => prev.filter(p => p.id !== id));
    toast.info('Eliminada');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><ImageIcon/> Galería</h1>
        <div className="flex items-center gap-2">
          <select value={type} onChange={e=> setType(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
            <option value="progress">Progreso</option>
            <option value="meal">Comidas</option>
          </select>
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:.95}} onClick={()=> setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-md"><Upload size={18}/>Subir</motion.button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(p => (
          <div key={p.id} className="relative group rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-[4/5]">
            <img src={p.url} alt={p.caption || ''} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2 text-white text-xs">
              <p className="font-medium truncate">{p.caption || '—'}</p>
              <p className="text-[10px]">{new Date(p.created_at).toLocaleString()}</p>
              <button onClick={()=> remove(p.id)} className="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-80 hover:opacity-100"><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
        {photos.length===0 && <p className="text-sm text-gray-500 col-span-full">No hay fotos.</p>}
      </div>
      <AnimatePresence>
        {showUpload && (
          <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=> setShowUpload(false)}>
            <motion.form onSubmit={submit} initial={{scale:.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:.9, opacity:0}} onClick={e=> e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2"><Camera size={16}/> Subir Foto</h3>
                <button type="button" onClick={()=> setShowUpload(false)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"><X size={14}/></button>
              </div>
              <input type="file" accept="image/*" onChange={e=> setFile(e.target.files[0])} required className="text-sm" />
              <input type="text" placeholder="Descripción" value={caption} onChange={e=> setCaption(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm" />
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:.97}} disabled={uploading} type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-60">{uploading? 'Subiendo...' : 'Subir'}</motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGallery;
