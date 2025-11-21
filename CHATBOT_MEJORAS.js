// INSTRUCCIONES PARA ACTUALIZAR CHATBOT.JS

/**
 * MEJORAS IMPLEMENTADAS:
 * ✅ 1. Límite de 500 caracteres por mensaje
 * ✅ 2. Contador de caracteres visible
 * ✅ 3. Historial de conversaciones estilo ChatGPT
 * ✅ 4. Crear nueva conversación
 * ✅ 5. Eliminar conversaciones
 * ✅ 6. Sidebar con lista de conversaciones
 * ✅ 7. Guardado automático en Firebase
 * ✅ 8. Títulos automáticos de conversaciones
 */

// PASO 1: Actualizar imports
import { Plus, Trash2, MessageCircle, History } from 'lucide-react';
import { deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// PASO 2: Agregar al estado del componente
const [conversations, setConversations] = useState([]);
const [activeConversationId, setActiveConversationId] = useState(null);
const [showSidebar, setShowSidebar] = useState(true);
const [charCount, setCharCount] = useState(0);
const MAX_CHARS = 500;

// PASO 3: Cargar conversaciones desde Firebase
useEffect(() => {
  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const conversationsRef = collection(db, 'users', user.uid, 'conversations');
      const q = query(conversationsRef, orderBy('lastUpdated', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      
      const convos = [];
      querySnapshot.forEach((doc) => {
        convos.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setConversations(convos);
      
      // Si no hay conversación activa, crear una nueva
      if (!activeConversationId && convos.length > 0) {
        setActiveConversationId(convos[0].id);
        loadConversationMessages(convos[0].id);
      } else if (convos.length === 0) {
        createNewConversation();
      }
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    }
  };
  
  loadConversations();
}, [user]);

// PASO 4: Crear nueva conversación
const createNewConversation = async () => {
  if (!user) return;
  
  try {
    const conversationsRef = collection(db, 'users', user.uid, 'conversations');
    const newConvo = await addDoc(conversationsRef, {
      title: 'Nueva conversación',
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      messageCount: 0
    });
    
    setActiveConversationId(newConvo.id);
    setMessages([
      { id: 'welcome', text: WELCOME_MESSAGE, sender: 'bot', timestamp: new Date().toISOString() }
    ]);
    
    // Recargar lista de conversaciones
    const q = query(conversationsRef, orderBy('lastUpdated', 'desc'), limit(20));
    const querySnapshot = await getDocs(q);
    const convos = [];
    querySnapshot.forEach((doc) => {
      convos.push({ id: doc.id, ...doc.data() });
    });
    setConversations(convos);
    
    console.log('✅ Nueva conversación creada:', newConvo.id);
  } catch (error) {
    console.error('Error creando conversación:', error);
  }
};

// PASO 5: Eliminar conversación
const deleteConversation = async (conversationId) => {
  if (!user) return;
  
  try {
    // Confirmar eliminación
    if (!window.confirm('¿Eliminar esta conversación?')) return;
    
    // Eliminar mensajes de la conversación
    const messagesRef = collection(db, 'users', user.uid, 'conversations', conversationId, 'messages');
    const messagesSnapshot = await getDocs(messagesRef);
    const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Eliminar la conversación
    const convoRef = doc(db, 'users', user.uid, 'conversations', conversationId);
    await deleteDoc(convoRef);
    
    // Actualizar estado
    const updatedConvos = conversations.filter(c => c.id !== conversationId);
    setConversations(updatedConvos);
    
    // Si era la activa, crear nueva
    if (activeConversationId === conversationId) {
      if (updatedConvos.length > 0) {
        setActiveConversationId(updatedConvos[0].id);
        loadConversationMessages(updatedConvos[0].id);
      } else {
        createNewConversation();
      }
    }
    
    console.log('✅ Conversación eliminada:', conversationId);
  } catch (error) {
    console.error('Error eliminando conversación:', error);
  }
};

// PASO 6: Cargar mensajes de una conversación
const loadConversationMessages = async (conversationId) => {
  if (!user) return;
  
  try {
    const messagesRef = collection(db, 'users', user.uid, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));
    const querySnapshot = await getDocs(q);
    
    const msgs = [
      { id: 'welcome', text: WELCOME_MESSAGE, sender: 'bot', timestamp: new Date().toISOString() }
    ];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      msgs.push({
        id: doc.id,
        text: data.message,
        sender: data.sender,
        timestamp: data.timestamp,
        isLocal: data.isLocal || false
      });
    });
    
    setMessages(msgs);
    setActiveConversationId(conversationId);
  } catch (error) {
    console.error('Error cargando mensajes:', error);
  }
};

// PASO 7: Guardar mensaje con conversación
const saveChatMessage = async (message, sender, isLocal = false) => {
  if (!user || !activeConversationId) return;
  
  try {
    const messagesRef = collection(db, 'users', user.uid, 'conversations', activeConversationId, 'messages');
    await addDoc(messagesRef, {
      message,
      sender,
      isLocal,
      timestamp: serverTimestamp()
    });
    
    // Actualizar conversación
    const convoRef = doc(db, 'users', user.uid, 'conversations', activeConversationId);
    const convoSnap = await getDoc(convoRef);
    const currentData = convoSnap.data();
    
    // Generar título automático del primer mensaje del usuario
    let title = currentData.title;
    if (title === 'Nueva conversación' && sender === 'user') {
      title = message.substring(0, 40) + (message.length > 40 ? '...' : '');
    }
    
    await updateDoc(convoRef, {
      lastUpdated: serverTimestamp(),
      messageCount: (currentData.messageCount || 0) + 1,
      title
    });
  } catch (error) {
    console.error('Error guardando mensaje:', error);
  }
};

// PASO 8: Manejar cambio de input con límite
const handleInputChange = (e) => {
  const value = e.target.value;
  if (value.length <= MAX_CHARS) {
    setInput(value);
    setCharCount(value.length);
  }
};

// PASO 9: UI del Sidebar
const renderSidebar = () => (
  <div className="w-64 bg-black/30 backdrop-blur-sm h-full flex flex-col p-4">
    {/* Botón Nueva Conversación */}
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={createNewConversation}
      className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center gap-2 justify-center"
    >
      <Plus size={20} />
      Nueva Conversación
    </motion.button>
    
    {/* Lista de Conversaciones */}
    <div className="flex-1 overflow-y-auto space-y-2">
      {conversations.map((convo) => (
        <div
          key={convo.id}
          className={`p-3 rounded-lg cursor-pointer flex items-center justify-between group ${
            activeConversationId === convo.id
              ? 'bg-white/20'
              : 'bg-white/5 hover:bg-white/10'
          }`}
          onClick={() => loadConversationMessages(convo.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle size={16} className="flex-shrink-0" />
              <p className="text-sm font-medium truncate">{convo.title}</p>
            </div>
            <p className="text-xs opacity-50">
              {convo.messageCount || 0} mensajes
            </p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteConversation(convo.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

// PASO 10: UI del Input con contador
const renderInput = () => (
  <div className="space-y-2">
    {/* Contador de caracteres */}
    <div className="flex justify-between items-center px-2">
      <span className={`text-xs ${charCount > MAX_CHARS * 0.9 ? 'text-red-400' : 'opacity-50'}`}>
        {charCount}/{MAX_CHARS} caracteres
      </span>
      {charCount > MAX_CHARS * 0.9 && (
        <span className="text-xs text-red-400">⚠️ Cerca del límite</span>
      )}
    </div>
    
    {/* Input */}
    <div className="flex gap-2">
      <textarea
        value={input}
        onChange={handleInputChange}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        placeholder="Escribe tu mensaje... (máximo 500 caracteres)"
        className="flex-1 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        rows="3"
        disabled={isLoading}
        maxLength={MAX_CHARS}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSendMessage}
        disabled={isLoading || !input.trim() || charCount > MAX_CHARS}
        className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
      >
        <Send size={24} />
      </motion.button>
    </div>
  </div>
);

// ESTRUCTURA FIREBASE SUGERIDA:
/**
 * users/{userId}/conversations/{conversationId}
 *   - title: string
 *   - createdAt: timestamp
 *   - lastUpdated: timestamp
 *   - messageCount: number
 *   
 *   /messages/{messageId}
 *     - message: string
 *     - sender: 'user' | 'bot'
 *     - isLocal: boolean
 *     - timestamp: timestamp
 */
