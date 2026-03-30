import { createContext, useState } from "react";

export const AuthContext = createContext({} as any);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);

  const login = (email: string, password: string) => {
    if (email && password) setUser(email);
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};