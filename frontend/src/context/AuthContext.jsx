import { createContext, useEffect, useState } from "react";

import api, { setAccessToken } from "../api/axios";

export const AuthContext = createContext();

const warmUpPythonService = () => {
    api.get("/analysis/wake-python").catch(() => {
      // silently ignore
    });
};

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // will check if the user is logged in or not
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.data.user);
        warmUpPythonService();
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const { accessToken, userWithoutPassword } = data.data;
    setAccessToken(accessToken);
    setUser(userWithoutPassword);
    warmUpPythonService();
    return userWithoutPassword;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return data.data;
  };

  const logout = async () => {
    try {
        await api.post("/auth/logout");
    } catch (error) {
        console.error("Logout failed on server, clearing local state anyway");
    }finally{
        setAccessToken(null)
        setUser(null)
    }
  };
  
  const googleAuth = async (credential) => {
    const { data } = await api.post("/auth/google", { credential });
    const { accessToken, userWithoutPassword } = data.data;
    setAccessToken(accessToken);
    setUser(userWithoutPassword);
    warmUpPythonService();
    return userWithoutPassword;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, googleAuth }}>
        {children}
    </AuthContext.Provider>
  )

}
