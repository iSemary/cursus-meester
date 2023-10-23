"use client";
import React, { createContext, useContext, useState } from "react";

const VisibilityContext = createContext();

export const useVisibility = () => useContext(VisibilityContext);

export const SidebarVisibility = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <VisibilityContext.Provider value={{ isVisible, setIsVisible }}>
            {children}
        </VisibilityContext.Provider>
    );
};
