import Controls from './components/Controls'
import ResponsiveContent from './components/device'
import Information from './components/information'
import MainGame from './components/MainGame'
import Mobile from './components/mobile'
import { AppProvider } from './provider/AppProvider'


function App() {
    return (
        <ResponsiveContent
            desktop={
                <>
                    <AppProvider>
                        <Information />
                        <MainGame />
                        <Controls />
                    </AppProvider>
                </>
            }
            mobile={
                <Mobile />
            }
        />
    )
}

export default App
