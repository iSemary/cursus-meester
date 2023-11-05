"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Token } from "../utilities/Authentication/Token";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (Token.check()) {
                setUser(await Token.getUser());
            }
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
