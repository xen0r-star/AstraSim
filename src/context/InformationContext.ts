import { createContext, useContext } from "react";


interface InformationContextType {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InformationContext = createContext<InformationContextType | undefined>(undefined);

export const useInformation = () => {
    const context = useContext(InformationContext);
    if (!context) throw new Error('useInformation must be used within an InformationProvider');
    return context;
};
