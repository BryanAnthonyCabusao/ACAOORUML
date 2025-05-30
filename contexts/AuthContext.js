// contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Initialization logic here
      setLoading(false);
    };

    init();
  }, []);

  const signIn = (userData) => {
    // Set a dummy session object
    setSession({ user: userData || { id: '1', email: 'test@example.com' } });
  };

  const value = {
    session,
    user: session?.user,
    signIn,
    signOut: () => setSession(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
