import React, { useState } from 'react';
import { PanelContext } from '../context/panelContext';


export const PanelProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    return (
        <PanelContext.Provider value={{ isVisible, setIsVisible }}>
            {children}
        </PanelContext.Provider>
    );
};