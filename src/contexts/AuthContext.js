import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword,
  observeAuthState,
  getUserProfile,
  updateUserProfile
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Detectar cambios en conexión
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Conexión establecida');
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      console.log('📡 Sin conexión');
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    console.log('🔍 Inicializando Firebase Auth...');
    
    const unsubscribe = observeAuthState(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('✅ Usuario autenticado:', firebaseUser.email);
          setUser(firebaseUser);
          
          try {
            const profile = await getUserProfile(firebaseUser.uid);
            setUserProfile(profile);
            console.log('✅ Perfil cargado:', profile);
          } catch (error) {
            console.error('Error cargando perfil:', error);
            setUserProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || ''
            });
          }
        } else {
          console.log('❌ No hay usuario autenticado');
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error en observer de auth:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      console.log('🔐 Iniciando sesión con Firebase...', email);
      
      const result = await loginUser(email, password);
      
      setUser(result.user);
      setUserProfile(result.profile);
      
      console.log('✅ Login exitoso:', result.user.email);
      return { 
        success: true, 
        message: '¡Bienvenido de vuelta!' 
      };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      console.log('📝 Registrando usuario en Firebase...', userData.email);
      
      const { email, password, ...additionalData } = userData;
      const result = await registerUser(email, password, additionalData);
      
      setUser(result.user);
      setUserProfile(result.profile);
      
      console.log('✅ Registro exitoso:', result.user.email);
      return { 
        success: true, 
        message: '¡Cuenta creada exitosamente!' 
      };
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return { 
        success: false, 
        error: error.message || 'Error al crear la cuenta' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      console.log('🚪 Cerrando sesión...');
      
      // Limpiar caché de localStorage
      if (user?.uid || user?.id) {
        const userId = user.uid || user.id;
        localStorage.removeItem(`snorxfit_profile_${userId}`);
        console.log('🧹 Caché de perfil limpiado');
      }
      
      await logoutUser();
      
      setUser(null);
      setUserProfile(null);
      
      console.log('✅ Sesión cerrada exitosamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      return { 
        success: false, 
        error: error.message || 'Error al cerrar sesión' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      console.log('📧 Enviando email de recuperación...', email);
      
      await resetPassword(email);
      
      console.log('✅ Email de recuperación enviado');
      return { 
        success: true, 
        message: 'Te hemos enviado un email con instrucciones para recuperar tu contraseña' 
      };
    } catch (error) {
      console.error('❌ Error en recuperación de contraseña:', error);
      return { 
        success: false, 
        error: error.message || 'Error al enviar el email de recuperación' 
      };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      console.log('🔄 Actualizando perfil...');
      
      await updateUserProfile(user.uid, updates);
      
      const updatedProfile = await getUserProfile(user.uid);
      setUserProfile(updatedProfile);
      
      console.log('✅ Perfil actualizado');
      return { success: true };
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      return { 
        success: false, 
        error: error.message || 'Error al actualizar el perfil' 
      };
    }
  };

  const value = {
    user,
    userProfile,
    isLoading,
    isOnline,
    login,
    register,
    logout,
    forgotPassword,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
