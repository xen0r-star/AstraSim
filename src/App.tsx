import Controls from './components/Controls'
import ResponsiveContent from './components/Device'
import Information from './components/Information'
import MainGame from './components/MainGame'
import Mobile from './components/Mobile'
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
