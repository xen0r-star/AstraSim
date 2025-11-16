import React, { type ReactNode } from 'react';
import { drawBorder, drawGrid } from '../draw/DrawHUD';
import p5 from 'p5';


interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    private containerRef = React.createRef<HTMLDivElement>();
    private p5Instance: p5 | null = null;

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: unknown, info: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, info);
    }

    componentDidMount() {
        if (this.state.hasError && this.containerRef.current) {
            const sketch = (p: p5) => {
                p.setup = () => {
                    p.createCanvas(p.windowWidth, p.windowHeight);
                };

                p.windowResized = () => {
                    p.resizeCanvas(p.windowWidth, p.windowHeight);
                };

                p.draw = () => {
                    p.background(0, 124, 139); 
                    drawGrid(p);
                    drawBorder(p);
                };
            };

            this.p5Instance = new p5(sketch, this.containerRef.current);
        }
    }

    componentWillUnmount() {
        this.p5Instance?.remove();
    }

    render() {
        if (this.state.hasError) {
            return (
            <div style={{ position: 'relative' }}>
                <div ref={this.containerRef}></div>

                <div className='TextTitle select-none' style={{top: 30, left: '50%', transform: 'translateX(-50%)', cursor: 'pointer'}} onClick={() => {
                    window.open('https://github.com/Xen0r-Star/AstraSim');
                }}>
                    ASTRA SIM
                </div>

                <div className='TextBig' style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                    Error occurred while loading the simulation
                </div>
            </div>
            );
        }

        return this.props.children;
    }
}
