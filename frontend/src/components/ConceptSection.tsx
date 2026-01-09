function ConceptSection() {
    return (
        <section id="concept" className="section concept-section">
            <div className="container">
                <div className="section-header">
                    <span className="badge">项目愿景</span>
                    <h2 className="section-title">为什么叫"送你一朵小红花"？</h2>
                    <p className="section-subtitle">双重温暖的含义，连接捐赠者与受助者。</p>
                </div>

                <div className="concept-grid">
                    <div className="card card-rose text-center">
                        <div className="card-icon-wrapper">
                            <svg className="card-icon card-icon-rose" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                        <h3 className="card-title">致捐赠者：每一位献出爱心的你</h3>
                        <p className="card-text">
                            小红花是你精神的褒奖。通过区块链技术，你的每一次善举都会生成一枚不可篡改的 NFT 荣誉勋章，永久记录在链上。
                        </p>
                    </div>

                    <div className="card card-blue text-center">
                        <div className="card-icon-wrapper">
                            <svg className="card-icon card-icon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" />
                                <circle cx="12" cy="12" r="4" />
                            </svg>
                        </div>
                        <h3 className="card-title">致受助者：每一位需要帮助的你</h3>
                        <p className="card-text">
                            小红花是经济的援助。无论你身在何处，来自全球 Web3 世界的资金支持都会跨越地域和链的边界，温暖抵达。
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ConceptSection
