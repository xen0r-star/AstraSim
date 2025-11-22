import React, { useState } from 'react';
import { InformationContext } from '../context/InformationContext';
import { PanelContext } from '../context/panelContext';


export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [show, setShow] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    return (
        <InformationContext.Provider value={{ show, setShow }}>
            <PanelContext.Provider value={{ isVisible, setIsVisible }}>
                {children}
            </PanelContext.Provider>
        </InformationContext.Provider>
    );
};