import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import { motion } from "framer-motion";
import { drawGrid } from '../draw/DrawHUD';
import { drawPlanet } from '../draw/DrawPlanet';
import { drawBorder } from '../draw/DrawHUD';
import { usePanel } from '../context/panelContext';
import { useInformation } from '../context/InformationContext';
import { MASS_DISPLAY_MULTIPLIER, timeScales } from '../config/constants';
import { instanceSimulation as simulation } from '../physics/simulation';
import type Planet from '../physics/planet';
import { isUserSelectingText } from '../utils/userSelectingText';



const MainGame: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const { isVisible } = usePanel();
    const { show, setShow } = useInformation();

    const offsetX = useRef(window.innerWidth / 2);
    const offsetY = useRef(window.innerHeight / 2);
    const zoom = useRef(60); // Default: 1 AU = 60 pixels
    const isDragging = useRef(false);
    const lastMouseX = useRef(0);
    const lastMouseY = useRef(0);
    const isAddingPlanet = useRef(false);

    const [zoomDisplay, setZoomDisplay] = useState(60);
    const [fpsDisplay, setFpsDisplay] = useState(0);
    const [offsetXDisplay, setOffsetXDisplay] = useState(0);
    const [offsetYDisplay, setOffsetYDisplay] = useState(0);
    const [planetInformation, setPlanetInformation] = useState<Planet | null>(null);

    // Simulation speeds in steps/frame
    const [timeScaleIndex, setTimeScaleIndex] = useState(2);
    const [stepsPerFrame, setStepsPerFrame] = useState(1); // Default: 1 step/frame
    

    const nextTimeScale = () => {
        const next = (timeScaleIndex + 1) % timeScales.length;
        setTimeScaleIndex(next);
        setStepsPerFrame(timeScales[next]);
    };

    const focusPlanet = (planet: Planet) => {
        // Center the camera on the planet
        offsetX.current = window.innerWidth / 2 - planet.pos.x * zoom.current;
        offsetY.current = window.innerHeight / 2 - planet.pos.y * zoom.current;
        
        setOffsetXDisplay(offsetX.current - window.innerWidth / 2);
        setOffsetYDisplay(offsetY.current - window.innerHeight / 2);
    }

    const overPlanet = (worldMouseX: number, worldMouseY: number): number | null => {
        for (let i = 0; i < simulation.planets.length; i++) {
            const planet = simulation.planets[i];
            if (planet.alive) {
                const dx = worldMouseX - planet.pos.x;
                const dy = worldMouseY - planet.pos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const clickRadius = planet.radius / zoom.current;

                if (distance <= clickRadius) {
                    return i;
                }
            }
        }
        return null;
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

                // Update cursor
                const worldMouseX = (p5.mouseX - offsetX.current) / zoom.current;
                const worldMouseY = (p5.mouseY - offsetY.current) / zoom.current;
                const clickedPlanetIndex = overPlanet(worldMouseX, worldMouseY);

                if (clickedPlanetIndex !== null) document.body.style.cursor = 'pointer';
                else document.body.style.cursor = 'default';

                // Draw border
                drawBorder(p5);

                setFpsDisplay(p5.frameRate());
            };

            p5.mousePressed = (event) => {
                if (event && event.button === 0) { // Left click
                    if (isAddingPlanet.current) {
                        document.body.style.cursor = 'default';

                        const worldX = (p5.mouseX - offsetX.current) / zoom.current;
                        const worldY = (p5.mouseY - offsetY.current) / zoom.current;

                        const randomColor = {
                            r: Math.floor(Math.random() * 255),
                            g: Math.floor(Math.random() * 255),
                            b: Math.floor(Math.random() * 255)
                        };

                        simulation.addPlanet(
                            worldX,                      // world X coordinate
                            worldY,                      // world Y coordinate
                            0,                           // vx velocity
                            0,                           // vy velocity
                            1 / MASS_DISPLAY_MULTIPLIER, // mass
                            5,                           // radius
                            `Planet ${simulation.planets.length + 1}`,
                            randomColor
                        );

                        isAddingPlanet.current = false;
                        window.dispatchEvent(new Event('planetAdded'));

                    } else {
                        // Check if clicked on a planet
                        const worldMouseX = (p5.mouseX - offsetX.current) / zoom.current;
                        const worldMouseY = (p5.mouseY - offsetY.current) / zoom.current;
                        const clickedPlanetIndex = overPlanet(worldMouseX, worldMouseY);

                        if (clickedPlanetIndex !== null) { // Clicked on a planet
                            setPlanetInformation(simulation.planets[clickedPlanetIndex]);

                        } else { // Clicked elsewhere
                            setPlanetInformation(null);
                            isDragging.current = true;
                            lastMouseX.current = p5.mouseX;
                            lastMouseY.current = p5.mouseY;
                        }
                    }
                }
            };

            p5.mouseReleased = (event) => {
                if (event && event.button === 0) {
                    isDragging.current = false;
                }
            };

            p5.keyPressed = () => {
                if (p5.keyCode === 27) { // ESC key
                    if (isAddingPlanet.current) {
                        isAddingPlanet.current = false;
                        window.dispatchEvent(new Event('cancelAddPlanet'));
                    }
                }
            };

            p5.mouseDragged = () => {
                if (isUserSelectingText() || show) return;

                if (isDragging.current && !isAddingPlanet.current) {
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
                if (show) return;

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


        const p5Instance = new p5(sketch, canvasRef.current!);

        const handleFocusPlanet = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { planet } = customEvent.detail;
            focusPlanet(planet);
        };

        const handleStartAddingPlanet = () => {
            isAddingPlanet.current = true;
        };


        window.addEventListener('focusPlanet', handleFocusPlanet);
        window.addEventListener('startAddingPlanet', handleStartAddingPlanet);

        return () => {
            p5Instance.remove();
            window.removeEventListener('focusPlanet', handleFocusPlanet);
            window.removeEventListener('startAddingPlanet', handleStartAddingPlanet);
        };
    }, [show, stepsPerFrame]);


    return (
        <div style={{ position: 'relative' }}>
            <div ref={canvasRef}></div>

            <div 
                className='TextPrimary select-none' 
                style={{top: 30, left: 35, cursor: 'pointer'}} 
                onClick={() => {
                    window.open('https://github.com/Xen0r-Star/AstraSim');
                }}
            >
                ASTRA SIM
            </div>
            <div 
                className='TextSecondary select-none' 
                style={{top: 58, left: 35, cursor: 'pointer'}} 
                onClick={() => {
                    window.open('https://github.com/Xen0r-Star');
                }}
            >
                by Xen0r Star
            </div>

            <div className='TextSecondary select-none' style={{bottom: 35, left: 35}}>
                <div>Controls:</div>
                <div> - Mouse Wheel: Zoom In/Out</div>
                <div> - Click + Drag: Pan View</div>
                <div style={{ display: 'flex', marginTop: 10, alignItems: 'center', gap: 8 }}>
                    <div title='Open information' style={{ zIndex: 1, display: 'flex', opacity: '80%', cursor: 'pointer' }} onClick={() => {
                        localStorage.removeItem("informationRead");
                        setShow(true);
                    }}>
                        <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M256 56C145.72 56 56 145.72 56 256C56 366.28 145.72 456 256 456C366.28 456 456 366.28 456 256C456 145.72 366.28 56 256 56ZM256 138C261.142 138 266.169 139.525 270.445 142.382C274.721 145.239 278.053 149.299 280.021 154.05C281.989 158.801 282.504 164.029 281.5 169.072C280.497 174.116 278.021 178.749 274.385 182.385C270.749 186.021 266.116 188.497 261.072 189.5C256.029 190.504 250.801 189.989 246.05 188.021C241.299 186.053 237.239 182.721 234.382 178.445C231.525 174.169 230 169.142 230 164C230 157.104 232.739 150.491 237.615 145.615C242.491 140.739 249.104 138 256 138ZM304 364H216C211.757 364 207.687 362.314 204.686 359.314C201.686 356.313 200 352.243 200 348C200 343.757 201.686 339.687 204.686 336.686C207.687 333.686 211.757 332 216 332H244V244H228C223.757 244 219.687 242.314 216.686 239.314C213.686 236.313 212 232.243 212 228C212 223.757 213.686 219.687 216.686 216.686C219.687 213.686 223.757 212 228 212H260C264.243 212 268.313 213.686 271.314 216.686C274.314 219.687 276 223.757 276 228V332H304C308.243 332 312.313 333.686 315.314 336.686C318.314 339.687 320 343.757 320 348C320 352.243 318.314 356.313 315.314 359.314C312.313 362.314 308.243 364 304 364Z" fill="white"/>
                        </svg>
                    </div>
                    <div title='Astronomical unit' style={{ fontSize: 12, opacity: 0.7 }}>
                        Units: 1 AU ≈ {zoomDisplay.toFixed(0)}px
                    </div>
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
                    <span 
                        title='Offset display' 
                        style={{ cursor: 'pointer'}} 
                        onClick={() => {
                            offsetX.current = window.innerWidth / 2;
                            offsetY.current = window.innerHeight / 2;
                            setOffsetXDisplay(0);
                            setOffsetYDisplay(0);
                        }}
                    >
                        x:{(-offsetXDisplay / zoomDisplay).toFixed(2)} y:{(offsetYDisplay / zoomDisplay).toFixed(2)} AU
                    </span>
                    <span> | </span>
                    <span 
                        title='Zoom' 
                        style={{ cursor: 'pointer'}} 
                        onClick={() => {
                            zoom.current = 60; 
                            setZoomDisplay(60);
                        }}
                    >
                        {(zoomDisplay / 60).toFixed(2)}x
                    </span>
                    <span> | </span>
                    <span title='Time spent'>
                        {simulation.time.toFixed(3)} Years
                    </span>
                    <span> | </span>
                    <span title='Frame rate'>
                        {fpsDisplay.toFixed(0)} FPS
                    </span>
                </div>

                <div style={{ position: 'absolute', bottom: 60, right: 35, display: 'flex', gap: 10 }}>
                    <button 
                        title={!simulation.isRunning ? 'Play' : 'Pause'}
                        onClick={() => simulation.isRunning = !simulation.isRunning} 
                    >
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
                    <button 
                        title='Restore the simulation'
                        onClick={() => {
                            simulation.reset();
                            offsetX.current = window.innerWidth / 2;
                            offsetY.current = window.innerHeight / 2;
                            zoom.current = 60;
                            setOffsetXDisplay(0);
                            setOffsetYDisplay(0);
                            setZoomDisplay(60);
                        }} 
                    >
                        <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M320 146C320 146 344.36 134 256 134C224.355 134 193.421 143.384 167.109 160.965C140.797 178.546 120.289 203.534 108.179 232.771C96.0693 262.007 92.9008 294.177 99.0744 325.214C105.248 356.251 120.487 384.761 142.863 407.137C165.239 429.513 193.749 444.752 224.786 450.926C255.823 457.099 287.993 453.931 317.229 441.821C346.466 429.711 371.454 409.203 389.035 382.891C406.616 356.579 416 325.645 416 294" stroke="white" strokeWidth="32" strokeMiterlimit="10" strokeLinecap="round"/>
                            <path d="M256 58L336 138L256 218" stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button 
                        title="Clear Trails"
                        onClick={() => simulation.clearTrails()}
                    >
                        <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="white" strokeMiterlimit="10" strokeWidth="32"/>
                            <path d="M320 320L192 192M192 320l128-128" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/>
                        </svg>
                    </button>
                    <button 
                        title='Change the refresh rate'
                        onClick={nextTimeScale} 
                        className='select-none'
                        style={{ minWidth: 55 }} 
                    >
                        {timeScales[timeScaleIndex]}x
                    </button>
                </div>
                
                {planetInformation && (
                    <div className='select-text' style={{ position: 'absolute', bottom: 120, right: 35, display: 'flex', gap: 10 }}>
                        <div className='planetInformation' style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <div 
                                    className='colorIcon' 
                                    style={{ background: `rgb(${planetInformation.color.r}, ${planetInformation.color.g}, ${planetInformation.color.b})` }} 
                                />
                                <h3 className='select-text' style={{ margin: 0 }}>
                                    {planetInformation.name}
                                </h3>
                            </div>

                            <div>
                                <p>
                                    Masse:
                                    <span style={{ fontWeight: 'bold', marginLeft: 5 }}>
                                        {(planetInformation.baseMass * MASS_DISPLAY_MULTIPLIER).toFixed(2)} ({(planetInformation.baseMass / 3.003489e-6).toFixed(2)}x Earth)
                                    </span>
                                </p>
                                <p>
                                    Draw radius:
                                    <span style={{ fontWeight: 'bold', marginLeft: 5 }}>
                                        {planetInformation.radius} ({(planetInformation.radius / 10).toFixed(2)}x Earth)
                                    </span>
                                </p>
                                <p>
                                    Position:
                                    <span style={{ fontWeight: 'bold', marginLeft: 5 }}>
                                        x={planetInformation.pos.x.toFixed(2)}, y={planetInformation.pos.y.toFixed(2)}
                                    </span>
                                </p>
                                <p>
                                    Velocity:
                                    <span style={{ fontWeight: 'bold', marginLeft: 5 }}>
                                        x={planetInformation.vel.x.toFixed(2)}, y={planetInformation.vel.y.toFixed(2)}
                                    </span>
                                </p>
                            </div>
{/* 
                            <div title='Focus planet' style={{ position: 'absolute', cursor: 'pointer', display: 'flex', top: 10, right: 10 }} onClick={() => focusPlanet(planetInformation)}>
                                <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            </div> */}
                        </div>
                    </div>
                )}
            </motion.div>

        </div>
    );
};


export default MainGame;
