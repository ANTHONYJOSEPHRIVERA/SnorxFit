import React, { useState, useEffect } from 'react';

const DebugUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Leer usuarios guardados
    const savedUsers = JSON.parse(localStorage.getItem('snorxfit_users') || '[]');
    setUsers(savedUsers);

    // Leer usuario actual
    const currentUserData = JSON.parse(localStorage.getItem('snorxfit_user') || 'null');
    setCurrentUser(currentUserData);
  }, []);

  const clearAllData = () => {
    localStorage.removeItem('snorxfit_users');
    localStorage.removeItem('snorxfit_user');
    // Limpiar también todos los perfiles
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('snorxfit_profile_')) {
        localStorage.removeItem(key);
      }
    });
    setUsers([]);
    setCurrentUser(null);
    alert('Todos los datos han sido eliminados');
  };

  return (
    <div className="fixed top-0 right-0 bg-white border-2 border-gray-300 p-4 m-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="font-bold text-lg mb-4 text-gray-800">🔍 Debug: Usuarios Guardados</h3>
      
      {/* Usuario actual */}
      <div className="mb-4 p-3 bg-blue-50 rounded border">
        <h4 className="font-semibold text-blue-800">Usuario Logueado:</h4>
        {currentUser ? (
          <div className="text-sm text-blue-700">
            <p>📧 {currentUser.email}</p>
            <p>👤 {currentUser.name}</p>
            <p>🆔 {currentUser.id}</p>
          </div>
        ) : (
          <p className="text-gray-500">Ninguno</p>
        )}
      </div>

      {/* Lista de usuarios */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">
          Usuarios Registrados ({users.length}):
        </h4>
        {users.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay usuarios registrados</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {users.map((user, index) => (
              <div key={user.id} className="p-2 bg-gray-50 rounded border text-sm">
                <p className="font-medium">#{index + 1}</p>
                <p>📧 {user.email}</p>
                <p>👤 {user.name}</p>
                <p>🆔 {user.id}</p>
                <p className="text-xs text-gray-500">
                  📅 {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón para limpiar */}
      <button
        onClick={clearAllData}
        className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
      >
        🗑️ Limpiar Todos los Datos
      </button>
    </div>
  );
};

export default DebugUsers;
