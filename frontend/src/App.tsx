import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import Navbar from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import DonationsPage from './pages/DonationsPage'
import EventDetailPage from './pages/EventDetailPage'

function App() {
    return (
        <WalletProvider>
            <BrowserRouter>
                <div style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif' }}>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/donations" element={<DonationsPage />} />
                        <Route path="/event/:eventId" element={<EventDetailPage />} />
                    </Routes>
                    <Footer />
                </div>
            </BrowserRouter>
        </WalletProvider>
    )
}

export default App
