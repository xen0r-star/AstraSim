import React, { useState } from 'react';
import { HexColorPicker } from "react-colorful";
import { usePanel } from '../context/PanelContext';
import { AnimatePresence, motion } from 'framer-motion';
import { instanceSimulation as simulation } from '../physics/simulation';
import { MASS_DISPLAY_MULTIPLIER } from '../config/constants';
import { rgbToHex } from '../utils/color';


const Controls: React.FC = () => {
    const { isVisible, setIsVisible } = usePanel();
    const [, forceUpdate] = useState({});
    const [colorPickerIndex, setColorPickerIndex] = useState<number | null>(null);
    const [isAddingPlanet, setIsAddingPlanet] = useState(false);

    const handleMassChange = (index: number, newMass: number) => {
        simulation.updatePlanetMass(index, newMass);
        forceUpdate({});
    };

    const handleRadiusChange = (index: number, newRadius: number) => {
        simulation.updatePlanetRadius(index, newRadius);
        forceUpdate({});
    };

    const handleAddPlanet = () => {
        setIsAddingPlanet(true);
        document.body.style.cursor = 'crosshair';
        // Dispatcher un événement pour indiquer qu'on veut ajouter une planète
        window.dispatchEvent(new CustomEvent('startAddingPlanet'));
    };

    const handleRemovePlanet = (index: number) => {
        simulation.removePlanet(index);
        forceUpdate({});
    };

    const handleFocusPlanet = (index: number) => {
        // Cette fonctionnalité nécessite d'accéder aux refs de MainGame
        // On va dispatcher un événement personnalisé
        window.dispatchEvent(new CustomEvent('focusPlanet', { detail: { planetIndex: index } }));
    };

    const handleColorChange = (index: number, hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        simulation.updatePlanetColor(index, { r, g, b });
        forceUpdate({});
    };


    React.useEffect(() => {
        const handlePlanetAdded = () => {
            setIsAddingPlanet(false);
            forceUpdate({});
        };

        const handleCancelAddPlanet = () => {
            setIsAddingPlanet(false);
        };

        window.addEventListener('planetAdded', handlePlanetAdded);
        window.addEventListener('cancelAddPlanet', handleCancelAddPlanet);

        return () => {
            window.removeEventListener('planetAdded', handlePlanetAdded);
            window.removeEventListener('cancelAddPlanet', handleCancelAddPlanet);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {!isVisible && (
                    <motion.div 
                        style={{ position: 'absolute', top: 30, right: 30, cursor: 'pointer' }} 
                        title="Unfold panel"
                        onClick={() => setIsVisible(true)}

                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                    >
                        <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M376.5 112L232.5 256L376.5 400M136 112V400" stroke="white" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence> 
                {isVisible && (
                    <motion.div 
                        className="panel"
                        onWheelCapture={(e) => e.stopPropagation()}

                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                    >
                        {colorPickerIndex !== null && (
                            <div style={{ position: 'absolute', top: 0, right: 310, zIndex: 1000 }}>
                                <div 
                                    style={{ 
                                        position: 'fixed', 
                                        top: 0, 
                                        left: 0, 
                                        right: 0, 
                                        bottom: 0 
                                    }} 
                                    onClick={() => setColorPickerIndex(null)}
                                />
                                <div style={{ position: 'relative' }}>
                                    <HexColorPicker 
                                        color={rgbToHex(simulation.planets[colorPickerIndex].color.r, simulation.planets[colorPickerIndex].color.g, simulation.planets[colorPickerIndex].color.b)} 
                                        onChange={(hex) => handleColorChange(colorPickerIndex, hex)} 
                                    />
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <div title='Fold panel'>
                                    <svg style={{ transform: 'rotate(180deg)', cursor: 'pointer' }} onClick={() => setIsVisible(false)} width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M376.5 112L232.5 256L376.5 400M136 112V400" stroke="white" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>

                                <h2 style={{ margin: 0, color: 'white', marginLeft: 10 }}>
                                    Controls
                                </h2>
                            </div>

                            <button title='Add planet' onClick={handleAddPlanet} style={{ opacity: isAddingPlanet ? 0.5 : 1 }}>
                                <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M256 112V400" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M400 256H112" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        <div className='containerPlanet' style={{ overflowY: 'auto' }}>
                            {simulation.planets.map((planet, index) => (
                                <div key={index}>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                                            <div 
                                                className='colorIcon' 
                                                style={{ background: `rgb(${planet.color.r}, ${planet.color.g}, ${planet.color.b})`, cursor: 'pointer' }} 
                                                onClick={() => setColorPickerIndex(colorPickerIndex === index ? null : index)}
                                            />

                                            <h3 style={{ margin: 0 }}>
                                                {planet.name}
                                            </h3>

                                            <div title='Focus planet' style={{ cursor: 'pointer', display: 'flex', marginLeft: 5 }} onClick={() => handleFocusPlanet(index)}>
                                                <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M304 416V304H416" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M314.199 314.23L431.999 432" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M208 96V208H96" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M197.8 197.77L80 80" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M416 208H304V96" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M314.23 197.8L432 80" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M96 304H208V416" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M197.77 314.199L80 431.999" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <circle cx="255.5" cy="256.5" r="25.5" fill="white"/>
                                                </svg>
                                            </div>
                                        </div>

                                        <div title='Remove planet' style={{ cursor: 'pointer', display: 'flex' }} onClick={() => handleRemovePlanet(index)}>
                                            <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M357.826 154.174L154.18 357.82" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M154.176 154.174L357.822 357.82" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                                        <span className='SubText'>Mass:</span>
                                        <input className='InputText' type="number" min={1} value={planet.mass * MASS_DISPLAY_MULTIPLIER} onChange={(e) => handleMassChange(index, Number(e.target.value) / MASS_DISPLAY_MULTIPLIER)} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                                        <span className='SubText'>Radius:</span>
                                        <input className='InputText' type="number" min={1} value={planet.radius} onChange={(e) => handleRadiusChange(index, Number(e.target.value))} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Controls;
