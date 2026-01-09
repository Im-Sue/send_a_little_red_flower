import { useState, useEffect } from 'react'
import ConnectWalletButton from './ConnectWalletButton'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: "核心理念", href: "#concept" },
        { name: "为什么是Polkadot", href: "#tech" },
        { name: "业务逻辑", href: "#logic" },
        { name: "监管与隐私", href: "#trust" },
        { name: "Q&A", href: "#qa" },
    ]

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-content">
                <a href="#" className="navbar-logo" onClick={() => window.scrollTo(0, 0)}>
                    <svg className="navbar-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" />
                        <circle cx="12" cy="12" r="4" />
                    </svg>
                    <span className="navbar-logo-text">送你一朵小红花</span>
                </a>

                {/* Desktop Nav */}
                <div className="navbar-links">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href}>
                            {link.name}
                        </a>
                    ))}
                    <ConnectWalletButton />
                </div>

                {/* Mobile Toggle */}
                <button
                    className="navbar-mobile-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="navbar-mobile-menu">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
                            {link.name}
                        </a>
                    ))}
                    <ConnectWalletButton />
                </div>
            )}
        </nav>
    )
}

export default Navbar
