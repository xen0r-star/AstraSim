import React, { createContext, useContext } from 'react';


interface PanelContextType {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}



export const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const usePanel = () => {
    const context = useContext(PanelContext);
    if (!context) throw new Error('usePanel must be used within a PanelProvider');
    return context;
};