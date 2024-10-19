import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const value = {
    user,
    setUser: (userData) => {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    },
    toggle,
    setToggle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
