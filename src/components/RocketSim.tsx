import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import { motion } from "framer-motion";
import { drawGrid } from '../draw/DrawHUD';
import { drawPlanet } from '../draw/DrawPlanet';
import { drawRocket } from '../draw/DrawRocket';
import { drawBorder } from '../draw/DrawHUD';
import { usePanel } from '../context/PanelContext';
import { simulation } from '../physics/Simulation';


const RocketSim: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const { isVisible } = usePanel();
    const rocketSVG = useRef<p5.Image | null>(null);

    const offsetX = useRef(0);         // décalage X de la vue
    const offsetY = useRef(0);         // décalage Y
    const zoom = useRef(1);            // facteur de zoom
    const isDragging = useRef(false);
    const lastMouseX = useRef(0);
    const lastMouseY = useRef(0);

    const [zoomDisplay, setZoomDisplay] = useState(1);
    const [fpsDisplay, setFpsDisplay] = useState(0);
    const [offsetXDisplay, setOffsetXDisplay] = useState(0);
    const [offsetYDisplay, setOffsetYDisplay] = useState(0);


    useEffect(() => {
        const sketch = (p: p5) => {
            p.setup = async () => {
                p.createCanvas(p.windowWidth, p.windowHeight);

                rocketSVG.current = await p.loadImage("/rocket.png");
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };

            p.draw = () => {
                p.background(0, 124, 139); 

                drawGrid(p);
                drawPlanet(p, simulation.getPlanet(), offsetX.current, offsetY.current, zoom.current);

                // Rocket physics
                if (simulation.getIsRunning()) {
                    simulation.getRocket().applyGravity(simulation.getPlanet());
                    // simulation.getRocket().update(1);
                }
                drawRocket(p, simulation.getRocket(), rocketSVG.current, offsetX.current, offsetY.current, zoom.current);
                
                drawBorder(p);

                setFpsDisplay(p.frameRate());
            };


            p.mousePressed = (event) => {
                if (event && event.button === 0) { // clic gauche
                    isDragging.current = true;
                    lastMouseX.current = p.mouseX;
                    lastMouseY.current = p.mouseY;
                }
            };

            p.mouseReleased = (event) => {
                if (event && event.button === 0) {
                    isDragging.current = false;
                }
            };

            p.mouseDragged = () => {
                if (isDragging.current) {
                    const dx = p.mouseX - lastMouseX.current;
                    const dy = p.mouseY - lastMouseY.current;
                    offsetX.current += dx;
                    offsetY.current += dy;
                    lastMouseX.current = p.mouseX;
                    lastMouseY.current = p.mouseY;

                    setOffsetXDisplay(offsetX.current);
                    setOffsetYDisplay(offsetY.current);
                }
            };

            p.mouseWheel = (event) => {
                const zoomFactor = 1.05;
                const wx = (p.mouseX - offsetX.current) / zoom.current;
                const wy = (p.mouseY - offsetY.current) / zoom.current;

                if (event && event.deltaY > 0) {
                    zoom.current /= zoomFactor; // zoom out
                    zoom.current = zoom.current > 0.25 ? zoom.current : 0.25;
                } else {
                    zoom.current *= zoomFactor; // zoom in
                    zoom.current = zoom.current < 10 ? zoom.current : 10;
                }

                // ajuster le offset pour garder la souris fixe
                offsetX.current = p.mouseX - wx * zoom.current;
                offsetY.current = p.mouseY - wy * zoom.current;

                setZoomDisplay(zoom.current);
            };

        };


        const myP5 = new p5(sketch, canvasRef.current!);
        return () => myP5.remove(); // nettoyer le canvas à la destruction
    }, []);


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
            </div>

            <motion.div 
                className='TextSecondary select-none' 
                style={{bottom: 35, right: 35, cursor: 'pointer'}} 
                onClick={() => { 
                    zoom.current = 1; 
                    offsetX.current = 0;
                    offsetY.current = 0;
                    setZoomDisplay(1);
                    setOffsetXDisplay(0);
                    setOffsetYDisplay(0);
                }}

                initial={{ x: 0 }}
                animate={{
                    x: isVisible ? -310 : 0
                }}
                transition={{ duration: 0.3 }}
            >
                x:{offsetXDisplay.toFixed(0)} y:{offsetYDisplay.toFixed(0)} | {zoomDisplay.toFixed(2)}x | {fpsDisplay.toFixed(0)} FPS
            </motion.div>
        </div>
    );
};

export default RocketSim;
