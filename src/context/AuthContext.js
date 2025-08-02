// context/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api'; // Импортируем наш API объект

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [expire, setExpire] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка срока действия токена
  const isTokenValid = useCallback(() => {
    if (!token || !expire) return false;
    return new Date(expire) > new Date();
  }, [token, expire]);

  // Загрузка данных пользователя
  const fetchUserInfo = useCallback(async () => {
    if (!isTokenValid()) return;

    try {
      // Используем метод getAccountInfo из API
      const response = await api.getAccountInfo();
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('Ошибка загрузки информации о пользователе:', error);
      return false;
    }
  }, [isTokenValid]);

  // Инициализация состояния при загрузке приложения
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedExpire = localStorage.getItem('tokenExpire');

      if (storedToken && storedExpire) {
        setToken(storedToken);
        setExpire(storedExpire);

        if (new Date(storedExpire) > new Date()) {
          // Токен действителен, загружаем данные пользователя
          await fetchUserInfo();
        } else {
          // Токен истек, очищаем хранилище
          localStorage.removeItem('accessToken');
          localStorage.removeItem('tokenExpire');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [fetchUserInfo]);

  // Логин пользователя
  const login = async (credentials) => {
    try {
      // Используем метод login из API
      const response = await api.login(credentials);
      const { accessToken, expire } = response.data;

      // Сохраняем данные в localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('tokenExpire', expire);

      // Обновляем состояние
      setToken(accessToken);
      setExpire(expire);

      // Загружаем информацию о пользователе
      await fetchUserInfo();

      return response.data;
    } catch (error) {
      // Очищаем состояние при ошибке
      setToken(null);
      setExpire(null);
      setUser(null);
      throw error;
    }
  };

  // Логаут
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpire');
    setToken(null);
    setExpire(null);
    setUser(null);
  }, []);

  // Проверка аутентификации
  const isAuthenticated = useCallback(() => {
    return isTokenValid() && user !== null;
  }, [isTokenValid, user]);

  // Синхронизация с интерцепторами API
  useEffect(() => {
    const handleTokenExpired = () => {
      if (token) {
        logout();
      }
    };

    window.addEventListener('tokenExpired', handleTokenExpired);

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        expire,
        isAuthenticated: isAuthenticated(),
        isLoading,
        login,
        logout,
        fetchUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};