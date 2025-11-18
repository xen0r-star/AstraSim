import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import { motion } from "framer-motion";
import { drawGrid } from '../draw/DrawHUD';
import { drawPlanet } from '../draw/DrawPlanet';
import { drawBorder } from '../draw/DrawHUD';
import { usePanel } from '../context/PanelContext';
import { simulation } from '../physics/simulation';
import { timeScales } from '../config/constants';


const MainGame: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const { isVisible } = usePanel();

    const offsetX = useRef(window.innerWidth / 2);
    const offsetY = useRef(window.innerHeight / 2);
    const zoom = useRef(60); // Base scale to convert AU to pixels (1 AU = 60 pixels)
    const isDragging = useRef(false);
    const lastMouseX = useRef(0);
    const lastMouseY = useRef(0);

    const [zoomDisplay, setZoomDisplay] = useState(60);
    const [fpsDisplay, setFpsDisplay] = useState(0);
    const [offsetXDisplay, setOffsetXDisplay] = useState(0);
    const [offsetYDisplay, setOffsetYDisplay] = useState(0);

    // Simulation speeds in steps/frame
    const [timeScaleIndex, setTimeScaleIndex] = useState(2); // Default: 5 steps/frame
    const [stepsPerFrame, setStepsPerFrame] = useState(5);
    

    const nextTimeScale = () => {
        const next = (timeScaleIndex + 1) % timeScales.length;
        setTimeScaleIndex(next);
        setStepsPerFrame(timeScales[next]);
    };

    useEffect(() => {
        const sketch = (p5: p5) => {
            p5.setup = async () => {
                p5.createCanvas(p5.windowWidth, p5.windowHeight);
            };

            p5.windowResized = () => {
                p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
            };

            p5.draw = () => {
                p5.background(0, 124, 139); 

                drawGrid(p5);
                
                // Perform multiple integration steps per frame
                if (simulation.isRunning) {
                    simulation.step(stepsPerFrame);
                }

                // Draw all the planets
                for (const planet of simulation.planets) {
                    drawPlanet(p5, planet, offsetX.current, offsetY.current, zoom.current);
                }

                drawBorder(p5);

                setFpsDisplay(p5.frameRate());
            };


            p5.mousePressed = (event) => {
                if (event && event.button === 0) { // Left click
                    isDragging.current = true;
                    lastMouseX.current = p5.mouseX;
                    lastMouseY.current = p5.mouseY;
                }
            };

            p5.mouseReleased = (event) => {
                if (event && event.button === 0) {
                    isDragging.current = false;
                }
            };

            p5.mouseDragged = () => {
                if (isDragging.current) {
                    const dx = p5.mouseX - lastMouseX.current;
                    const dy = p5.mouseY - lastMouseY.current;
                    offsetX.current += dx;
                    offsetY.current += dy;
                    lastMouseX.current = p5.mouseX;
                    lastMouseY.current = p5.mouseY;

                    setOffsetXDisplay(offsetX.current - window.innerWidth / 2);
                    setOffsetYDisplay(offsetY.current - window.innerHeight / 2);
                }
            };

            p5.mouseWheel = (event) => {
                const zoomFactor = 1.08;
                const wx = (p5.mouseX - offsetX.current) / zoom.current;
                const wy = (p5.mouseY - offsetY.current) / zoom.current;

                if (event && event.deltaY > 0) {
                    zoom.current /= zoomFactor; // zoom out
                    zoom.current = zoom.current > 5 ? zoom.current : 5;
                } else {
                    zoom.current *= zoomFactor; // zoom in
                    zoom.current = zoom.current < 500 ? zoom.current : 500;
                }

                // adjust the offset to keep the mouse fixed
                offsetX.current = p5.mouseX - wx * zoom.current;
                offsetY.current = p5.mouseY - wy * zoom.current;

                setZoomDisplay(zoom.current);
            };

        };


        const myP5 = new p5(sketch, canvasRef.current!);
        return () => myP5.remove();
    }, [stepsPerFrame]);


    return (
        <div style={{ position: 'relative' }}>
            <div ref={canvasRef}></div>

            <div className='TextPrimary select-none' style={{top: 30, left: 35, cursor: 'pointer'}} onClick={() => {
                window.open('https://github.com/Xen0r-Star/AstraSim');
            }}>
                ASTRA SIM
            </div>
            <div className='TextSecondary select-none' style={{top: 58, left: 35, cursor: 'pointer'}} onClick={() => {
                window.open('https://github.com/Xen0r-Star');
            }}>
                by Xen0r Star
            </div>

            <div className='TextSecondary select-none' style={{bottom: 35, left: 35}}>
                <div>Controls:</div>
                <div> - Mouse Wheel: Zoom In/Out</div>
                <div> - Click + Drag: Pan View</div>
                <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                    Units: 1 AU ≈ {zoomDisplay.toFixed(0)}px
                </div>
            </div>

            <motion.div 
                initial={{ x: 0 }}
                animate={{
                    x: isVisible ? -310 : 0
                }}
                transition={{ duration: 0.3 }}
            >
                <div className='TextSecondary select-none' style={{ bottom: 35, right: 35 }}>
                    <span style={{ cursor: 'pointer'}} onClick={() => {
                        offsetX.current = window.innerWidth / 2;
                        offsetY.current = window.innerHeight / 2;
                        setOffsetXDisplay(0);
                        setOffsetYDisplay(0);
                    }}>
                        x:{(-offsetXDisplay / zoomDisplay).toFixed(2)} y:{(offsetYDisplay / zoomDisplay).toFixed(2)} AU
                    </span>
                    <span> | </span>
                    <span style={{ cursor: 'pointer'}} onClick={() => {
                        zoom.current = 60; 
                        setZoomDisplay(60);
                    }}>
                        {(zoomDisplay / 60).toFixed(2)}x
                    </span>
                    <span> | </span>
                    <span>
                        {simulation.time.toFixed(3)} Years
                    </span>
                    <span> | </span>
                    <span>
                        {fpsDisplay.toFixed(0)} FPS
                    </span>
                </div>
                <div style={{ position: 'absolute', bottom: 60, right: 35, display: 'flex', gap: 10 }}>
                    <button onClick={() => simulation.isRunning = !simulation.isRunning}>
                        {!simulation.isRunning ? (
                            <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M132.999 440.002C126.859 439.99 120.828 438.381 115.499 435.332C103.499 428.532 96.0391 415.332 96.0391 401.002V111.002C96.0391 96.6318 103.499 83.4718 115.499 76.6718C120.955 73.5361 127.153 71.9236 133.446 72.0028C139.738 72.0819 145.894 73.8499 151.269 77.1218L399.119 225.482C404.284 228.721 408.543 233.218 411.494 238.553C414.446 243.888 415.994 249.885 415.994 255.982C415.994 262.079 414.446 268.076 411.494 273.41C408.543 278.745 404.284 283.243 399.119 286.482L151.229 434.882C145.728 438.207 139.427 439.977 132.999 440.002Z" fill="white"/>
                            </svg>
                        ) : (
                            <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M192 96H176V416H192V96Z" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M336 96H320V416H336V96Z" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}

                    </button>
                    <button onClick={() => {
                        simulation.reset();
                        offsetX.current = window.innerWidth / 2;
                        offsetY.current = window.innerHeight / 2;
                        zoom.current = 60;
                        setOffsetXDisplay(0);
                        setOffsetYDisplay(0);
                        setZoomDisplay(60);
                    }}>
                        <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M320 146C320 146 344.36 134 256 134C224.355 134 193.421 143.384 167.109 160.965C140.797 178.546 120.289 203.534 108.179 232.771C96.0693 262.007 92.9008 294.177 99.0744 325.214C105.248 356.251 120.487 384.761 142.863 407.137C165.239 429.513 193.749 444.752 224.786 450.926C255.823 457.099 287.993 453.931 317.229 441.821C346.466 429.711 371.454 409.203 389.035 382.891C406.616 356.579 416 325.645 416 294" stroke="white" strokeWidth="32" strokeMiterlimit="10" strokeLinecap="round"/>
                            <path d="M256 58L336 138L256 218" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button 
                        onClick={() => simulation.clearTrails()}
                        title="Clear Trails"
                    >
                        <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="white" strokeMiterlimit="10" strokeWidth="32"/>
                            <path d="M320 320L192 192M192 320l128-128" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/>
                        </svg>
                    </button>
                    <button style={{ minWidth: 55 }} onClick={nextTimeScale}>
                        {timeScales[timeScaleIndex]}x
                    </button>
                </div>
            </motion.div>

        </div>
    );
};

export default MainGame;
