import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apiRequest } from '../lib/queryClient';

export type User = {
  id: number;
  username: string;
  isAdmin: boolean;
};

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: async () => { throw new Error('Not implemented'); },
  logout: async () => {}
});

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<User> => {
    const res = await apiRequest('POST', '/api/auth/login', { username, password });
    const data = await res.json();
    setUser(data.user);
    return data.user;
  };

  const logout = async (): Promise<void> => {
    await apiRequest('POST', '/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);