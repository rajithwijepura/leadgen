import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  isLoading: boolean; // To handle initial token check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true

  useEffect(() => {
    // Check localStorage for token on initial load
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        console.log('AuthContext: Token found in localStorage on init.');
      }
    } catch (error) {
      console.error("AuthContext: Error reading token from localStorage", error);
    } finally {
      setIsLoading(false); // Done checking token
    }
  }, []);

  const login = (newToken: string) => {
    try {
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setIsAuthenticated(true);
      console.log('AuthContext: User logged in, token stored.');
    } catch (error) {
      console.error("AuthContext: Error saving token to localStorage", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      setToken(null);
      setIsAuthenticated(false);
      console.log('AuthContext: User logged out, token removed.');
    } catch (error) {
      console.error("AuthContext: Error removing token from localStorage", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
