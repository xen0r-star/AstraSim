import Controls from './components/Controls'
import MainGame from './components/MainGame'
import { PanelProvider } from './provider/PanelProvider'

function App() {
    return (
        <PanelProvider>
            <MainGame />
            <Controls />
        </PanelProvider>
    )
}

export default App
