function HeroSection() {
    return (
        <div className="hero">
            {/* Background Decorative Elements */}
            <div className="hero-blob hero-blob-1"></div>
            <div className="hero-blob hero-blob-2"></div>
            <div className="hero-blob hero-blob-3"></div>

            <div className="hero-content">
                <div className="hero-badge">
                    <span className="hero-badge-dot"></span>
                    <span className="hero-badge-text">Based on Polkadot & Hyperbridge</span>
                </div>

                <h1 className="hero-title">
                    让爱心跨越<span className="gradient-rose">链的边界</span><br />
                    让善款流向<span className="gradient-blue">透明如水</span>
                </h1>

                <p className="hero-subtitle">
                    构建一个去中心化、透明、隐私保护的跨链慈善捐助平台。
                    无论你在以太坊还是 Polkadot，你的善意都能以光速传递。
                </p>

                <div className="hero-actions">
                    <button className="btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        开始捐赠
                    </button>
                    <button className="btn-secondary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        查看白皮书
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll-hint">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </div>
        </div>
    )
}

export default HeroSection
