import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';

// Usa AsyncStorage no mobile e localStorage no web
let Storage;
if (Platform.OS === 'web') {
  Storage = {
    getItem: async (key) => localStorage.getItem(key),
    setItem: async (key, value) => localStorage.setItem(key, value),
    removeItem: async (key) => localStorage.removeItem(key),
  };
} else {
  try {
    Storage = require('@react-native-async-storage/async-storage').default;
  } catch (e) {
    // Fallback para localStorage se AsyncStorage não estiver disponível
    Storage = {
      getItem: async (key) => localStorage.getItem(key),
      setItem: async (key, value) => localStorage.setItem(key, value),
      removeItem: async (key) => localStorage.removeItem(key),
    };
  }
}

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarioSalvo();
  }, []);

  const carregarUsuarioSalvo = async () => {
    try {
      const storedUser = await Storage.getItem('@AppScholar:user');
      const storedToken = await Storage.getItem('@AppScholar:token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const api = require('../services/api').default;
      const response = await api.post('/login', credentials);
      const { token, usuario } = response.data;

      await Storage.setItem('@AppScholar:token', token);
      await Storage.setItem('@AppScholar:user', JSON.stringify(usuario));

      setUser(usuario);
      return { success: true, usuario };
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.'
      };
    }
  };

  const logout = async () => {
    console.log('🚪 Iniciando logout...');
    try {
      await Storage.removeItem('@AppScholar:token');
      await Storage.removeItem('@AppScholar:user');
      console.log('✅ Dados removidos do storage');
    } catch (error) {
      console.error('Erro ao limpar storage:', error);
      // Força limpeza mesmo com erro
      try {
        localStorage.removeItem('@AppScholar:token');
        localStorage.removeItem('@AppScholar:user');
      } catch (e) {
        console.error('Erro no localStorage:', e);
      }
    }
    
    // SEMPRE limpa o estado do usuário
    setUser(null);
    console.log('✅ Estado do usuário limpo');
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);