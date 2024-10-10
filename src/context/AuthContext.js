import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds user information
  const [toggle, setToggle] = useState(false); // Example state, if applicable

  const value = {
    user,
    setUser,
    toggle,
    setToggle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
