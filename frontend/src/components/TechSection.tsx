function TechSection() {
    const techPoints = [
        { title: "原生安全", desc: "共享 Polkadot 中继链安全，无需信任第三方桥" },
        { title: "低手续费", desc: "小额捐款也不会被 Gas 费'吃掉'" },
        { title: "全链互通", desc: "ETH, BSC, DOT... 资金无缝汇聚" }
    ]

    return (
        <section id="tech" className="section tech-section">
            <div className="container">
                <div className="tech-layout">
                    <div className="tech-content">
                        <span className="badge">技术架构</span>
                        <h2 className="section-title">为什么选择 Polkadot × 跨链？</h2>
                        <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '1.5rem', lineHeight: '1.7' }}>
                            苦难没有国界，爱心也不应有链的隔阂。传统跨链桥屡遭黑客攻击，资金安全岌岌可危。
                            我们采用 Polkadot 原生 XCM 架构，实现真正的"去信任"跨链。
                        </p>
                        <ul className="tech-list">
                            {techPoints.map((item, i) => (
                                <li key={i} className="tech-list-item">
                                    <svg className="tech-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    <div>
                                        <h4 className="tech-list-title">{item.title}</h4>
                                        <p className="tech-list-desc">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Comparison Visual */}
                    <div className="tech-visual">
                        <div className="comparison-card">
                            <h3 className="comparison-title">安全性对比</h3>
                            <div className="comparison-grid">
                                <div className="comparison-box comparison-box-bad">
                                    <div className="comparison-box-header comparison-box-header-bad">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6l12 12" />
                                        </svg>
                                        传统跨链桥
                                    </div>
                                    <div className="comparison-box-list">
                                        <p>⚠️ 中心化托管人</p>
                                        <p>⚠️ 黑客攻击热点(如 Ronin)</p>
                                        <p>⚠️ 资金被盗风险高</p>
                                    </div>
                                </div>
                                <div className="comparison-box comparison-box-good">
                                    <div className="comparison-box-header comparison-box-header-good">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                        Hyperbridge(Polkadot)
                                    </div>
                                    <div className="comparison-box-list">
                                        <p>✅ 密码学证明(ZK)</p>
                                        <p>✅ 共享中继链安全</p>
                                        <p>✅ 状态最终性验证</p>
                                    </div>
                                </div>
                            </div>

                            <div className="comparison-footer">
                                <div className="comparison-flow">
                                    <span>Moonbeam</span>
                                    <span className="comparison-flow-arrow">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                        XCM
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                    <span>Asset Hub</span>
                                    <span className="comparison-flow-arrow">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                        XCM
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                    <span>Hydra</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TechSection
