import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = (user) => {
        setIsAuthenticated(true);
        setUser(user);  // Set user data upon successful login
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);  // Clear user data on logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
