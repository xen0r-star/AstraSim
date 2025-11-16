import Controls from './components/Controls'
import RocketSim from './components/RocketSim'
import { PanelProvider } from './provider/PanelProvider'

function App() {
    return (
        <PanelProvider>
            <RocketSim />
            <Controls />
        </PanelProvider>
    )
}

export default App
