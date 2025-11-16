import React from 'react';
import { usePanel } from '../context/PanelContext';
import { AnimatePresence, motion } from 'framer-motion';
import { simulation } from '../physics/simulation';


const Controls: React.FC = () => {
    const { isVisible, setIsVisible } = usePanel();

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
                        <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <svg style={{ transform: 'rotate(180deg)', cursor: 'pointer' }} onClick={() => setIsVisible(false)} width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M376.5 112L232.5 256L376.5 400M136 112V400" stroke="white" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>

                            <h2 style={{ margin: 0, color: 'white', marginLeft: 10 }}>
                                Controls
                            </h2>
                        </div>

                        <div style={{ overflowY: 'auto' }}>
                            {simulation.getPlanets().map((planet, index) => (
                                <div key={index} style={{ marginBottom: 32 }}>
                                    <h3 style={{ margin: 0 }}>
                                        {planet.getName()}
                                    </h3>

                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                                        <span className='SubText'>Mass:</span>
                                        <input className='InputText' type="number" min={1} value={planet.getMass()} onChange={(e) => planet.setMass(Number(e.target.value))} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                                        <span className='SubText'>Radius:</span>
                                        <input className='InputText' type="number" min={1} value={planet.getRadius()} onChange={(e) => planet.setRadius(Number(e.target.value))} />
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
