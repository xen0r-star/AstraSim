import Controls from './components/Controls'
import ResponsiveContent from './components/device'
import MainGame from './components/MainGame'
import Mobile from './components/mobile'
import { PanelProvider } from './provider/PanelProvider'

function App() {
    return (
        <ResponsiveContent
            desktop={
                <PanelProvider>
                    <MainGame />
                    <Controls />
                </PanelProvider>
            }
            mobile={
                <Mobile />
            }
        />
    )
}

export default App
