import React, { type ReactNode, useState, useEffect } from "react";


interface ResponsiveContentProps {
    desktop: ReactNode;
    mobile: ReactNode;
}

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isDesktop;
}

const ResponsiveContent: React.FC<ResponsiveContentProps> = ({ desktop, mobile }) => {
    const isDesktop = useIsDesktop();

    return <>{isDesktop ? desktop : mobile}</>;
};

export default ResponsiveContent;
