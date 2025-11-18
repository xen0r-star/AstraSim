import Controls from './components/Controls'
import ResponsiveContent from './components/device'
import Information from './components/information'
import MainGame from './components/MainGame'
import Mobile from './components/mobile'
import { PanelProvider } from './provider/PanelProvider'

function App() {
    return (
        <ResponsiveContent
            desktop={
                <>
                    <Information />
                    <PanelProvider>
                        <MainGame />
                        <Controls />
                    </PanelProvider>
                </>
            }
            mobile={
                <Mobile />
            }
        />
    )
}

export default App
