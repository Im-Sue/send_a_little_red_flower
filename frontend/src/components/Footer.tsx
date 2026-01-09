function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <svg className="footer-logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" />
                            <circle cx="12" cy="12" r="4" />
                        </svg>
                        <span className="footer-logo-text">送你一朵小红花</span>
                    </div>
                    <p className="footer-desc">
                        基于 Polkadot 的去中心化慈善平台。<br />让爱心跨越链的边界。
                    </p>
                </div>

                <div className="footer-links">
                    <a href="#">GitHub</a>
                    <a href="#">Whitepaper</a>
                    <a href="#">Twitter</a>
                    <a href="#">Discord</a>
                </div>
            </div>
            <div className="footer-copyright">
                © 2024 Little Red Flower Charity. Built for the Polkadot Hackathon.
            </div>
        </footer>
    )
}

export default Footer
