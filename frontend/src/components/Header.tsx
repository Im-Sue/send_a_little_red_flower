import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ConnectWalletButton from './ConnectWalletButton'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const location = useLocation()
    const isHomePage = location.pathname === '/'

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Navigation links for the home page sections
    const homeNavLinks = [
        { name: "核心理念", hash: "#concept" },
        { name: "为什么是Polkadot", hash: "#tech" },
        { name: "业务逻辑", hash: "#logic" },
        { name: "监管与隐私", hash: "#trust" },
        { name: "Q&A", hash: "#qa" },
    ]

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-content">
                <Link to="/" className="navbar-logo">
                    <svg className="navbar-logo-icon" viewBox="0 0 24 24" fill="currentColor">
                        {/* 五瓣小红花 */}
                        <ellipse cx="12" cy="6" rx="3" ry="4" fill="#f43f5e" />
                        <ellipse cx="17.5" cy="10" rx="3" ry="4" transform="rotate(72 17.5 10)" fill="#fb7185" />
                        <ellipse cx="15.5" cy="16.5" rx="3" ry="4" transform="rotate(144 15.5 16.5)" fill="#f43f5e" />
                        <ellipse cx="8.5" cy="16.5" rx="3" ry="4" transform="rotate(-144 8.5 16.5)" fill="#fb7185" />
                        <ellipse cx="6.5" cy="10" rx="3" ry="4" transform="rotate(-72 6.5 10)" fill="#f43f5e" />
                        {/* 花蕊 */}
                        <circle cx="12" cy="12" r="3" fill="#fbbf24" />
                    </svg>
                    <span className="navbar-logo-text">送你一朵小红花</span>
                </Link>

                {/* Desktop Nav */}
                <div className="navbar-links">
                    {homeNavLinks.map((link) => (
                        isHomePage ? (
                            <a key={link.name} href={link.hash}>
                                {link.name}
                            </a>
                        ) : (
                            <Link key={link.name} to={`/${link.hash}`}>
                                {link.name}
                            </Link>
                        )
                    ))}
                    <Link
                        to="/donations"
                        className={`navbar-link-highlight ${location.pathname === '/donations' ? 'active' : ''}`}
                    >
                        💝 捐赠中心
                    </Link>
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
                    {homeNavLinks.map((link) => (
                        isHomePage ? (
                            <a key={link.name} href={link.hash} onClick={() => setIsOpen(false)}>
                                {link.name}
                            </a>
                        ) : (
                            <Link key={link.name} to={`/${link.hash}`} onClick={() => setIsOpen(false)}>
                                {link.name}
                            </Link>
                        )
                    ))}
                    <Link
                        to="/donations"
                        className="navbar-link-highlight"
                        onClick={() => setIsOpen(false)}
                    >
                        💝 捐赠中心
                    </Link>
                    <ConnectWalletButton />
                </div>
            )}
        </nav>
    )
}

export default Navbar


