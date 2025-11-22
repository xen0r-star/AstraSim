import React, { useState } from 'react';
import { InformationContext } from '../context/InformationContext';


export const InformationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [show, setShow] = useState(false);
    
    return (
        <InformationContext.Provider value={{ show, setShow }}>
            {children}
        </InformationContext.Provider>
    );
};