import { createContext, useState } from "react";

export const AuthContext = createContext({} as any);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (email: string, password: string) => {
    if (email && password) setUser(email);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};