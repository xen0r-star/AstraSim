import React from 'react';
import { usePanel } from '../context/PanelContext';
import { AnimatePresence, motion } from 'framer-motion';
import { simulation } from '../physics/Simulation';


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

                        <div>
                            <h3 style={{ margin: 0 }}>
                                Rocket
                            </h3>

                            <div>
                                <span style={{ width: 80 }}>Mass:</span>
                                <input type="number" style={{ width: 80, marginLeft: 10 }} /> kg
                            </div>
                            <div>
                                <span style={{ width: 80 }}>Thrust:</span>
                                <input type="number" style={{ width: 80, marginLeft: 10 }} /> N
                            </div>
                            <div>
                                <span style={{ width: 80 }}>Fuel Consumption:</span>
                                <input type="number" style={{ width: 80, marginLeft: 10 }} /> kg/s
                            </div>
                            <div>
                                <span style={{ width: 80 }}>Fuel:</span>
                                <input type="number" style={{ width: 80, marginLeft: 10 }} /> kg
                            </div>
                        </div>

                        <div>
                            <h3>
                                Planet
                            </h3>
                        </div>

                        <div>
                            <button onClick={() => simulation.play()}>play</button>
                            <button onClick={() => simulation.restart()}>restart</button>
                            <button>1x</button>
                        </div>


                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Controls;
