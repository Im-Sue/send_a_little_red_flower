import './index.css'
import { WalletProvider } from './contexts/WalletContext'
import Navbar from './components/Header'
import HeroSection from './components/HeroSection'
import ConceptSection from './components/ConceptSection'
import TechSection from './components/TechSection'
import LogicFlowSection from './components/LogicFlowSection'
import SupervisionSection from './components/SupervisionSection'
import RoadmapSection from './components/RoadmapSection'
import Footer from './components/Footer'

function App() {
    return (
        <WalletProvider>
            <div style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif' }}>
                <Navbar />
                <HeroSection />
                <ConceptSection />
                <TechSection />
                <LogicFlowSection />
                <SupervisionSection />
                <RoadmapSection />
                <Footer />
            </div>
        </WalletProvider>
    )
}

export default App
