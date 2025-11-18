import React, { useRef } from 'react';


const Information: React.FC = () => {
    const popUp = useRef<HTMLDivElement>(null);

    const closePopUp = () => {
        if (popUp.current) {
            popUp.current.style.display = 'none';
        }
    };


    return (
        <div ref={popUp} className='informationContainer' style={{ zIndex: 999 }}>
            <div className='informationBox TextNormal select-none'>
                <h1 style={{ fontSize: 36, fontFamily: 'monospace', fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
                    About Astra Sim
                </h1>


                <div style={{ marginBottom: 20 }}>
                    This simulation represents a simplified model of the solar system based on J2000 data (1 January 2000) from <a href="https://www.met.reading.ac.uk/~ross/Astronomy/Planets.html" target="_blank" rel="noopener noreferrer" className='link'>this source</a>.
                </div>
                <div style={{ marginBottom: 10 }}>
                    The distances between the planets (from centre to centre) and their orbital periods are to scale. However, the size of the planets is not to scale for reasons of visibility; they are resized according to the zoom level. This is also a simplified simulation that does not take into account all the rules.
                </div>


                <div>
                    The source code for this project is available on <a href="https://github.com/Xen0r-Star/AstraSim" target="_blank" rel="noopener noreferrer" className='link'>GitHub</a>.
                </div>

                <div style={{ marginTop: 150, textAlign: 'center' }}>
                    <button className='ButtonStandard TextNormal' onClick={closePopUp} style={{ width: '100%' }}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Information;
