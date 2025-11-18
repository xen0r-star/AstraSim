import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { drawGrid } from '../draw/DrawHUD';
import { drawBorder } from '../draw/DrawHUD';


const Mobile: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    
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
                drawBorder(p5);
            };
        };


        const myP5 = new p5(sketch, canvasRef.current!);
        return () => myP5.remove();
    }, []);


    return (
        <div style={{ position: 'relative' }}>
            <div ref={canvasRef}></div>

            <div className='TextTitle select-none' style={{top: 30, left: '50%', transform: 'translateX(-50%)', cursor: 'pointer'}} onClick={() => {
                window.open('https://github.com/Xen0r-Star/AstraSim');
            }}>
                ASTRA SIM
            </div>

            <div className='TextBig' style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                Sorry, this content is not available on mobile devices.
            </div>
        </div>
    );
};

export default Mobile;
