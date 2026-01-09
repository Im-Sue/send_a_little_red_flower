function SupervisionSection() {
    const layers = [
        {
            layer: "Layer 1",
            title: "智能合约自动化",
            icon: "cpu",
            features: ["时间锁 (TimeLock)", "里程碑释放", "自动退款机制"]
        },
        {
            layer: "Layer 2",
            title: "多签监管",
            icon: "link",
            features: ["3/5 多签审批", "大额转账冷却", "异常紧急冻结"]
        },
        {
            layer: "Layer 3",
            title: "社区验证",
            icon: "users",
            features: ["DAO 投票确认", "信誉积分系统", "去中心化仲裁"]
        }
    ]

    const getIcon = (name: string) => {
        switch (name) {
            case 'cpu':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                        <rect x="9" y="9" width="6" height="6" />
                        <line x1="9" y1="1" x2="9" y2="4" />
                        <line x1="15" y1="1" x2="15" y2="4" />
                        <line x1="9" y1="20" x2="9" y2="23" />
                        <line x1="15" y1="20" x2="15" y2="23" />
                        <line x1="20" y1="9" x2="23" y2="9" />
                        <line x1="20" y1="14" x2="23" y2="14" />
                        <line x1="1" y1="9" x2="4" y2="9" />
                        <line x1="1" y1="14" x2="4" y2="14" />
                    </svg>
                )
            case 'link':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                )
            case 'users':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <section id="trust" className="section supervision-section">
            <div className="container">
                <div className="section-header">
                    <span className="badge">监管机制</span>
                    <h2 className="section-title">三层防护，防止作恶</h2>
                    <p className="section-subtitle">资金不是一次性打给受助人，而是通过智能合约严格管控。</p>
                </div>

                <div className="supervision-grid">
                    {layers.map((card, i) => (
                        <div key={i} className="card supervision-card">
                            <span className="supervision-card-layer">{card.layer}</span>
                            <div className="supervision-card-icon">
                                {getIcon(card.icon)}
                            </div>
                            <h3 className="supervision-card-title">{card.title}</h3>
                            <ul className="supervision-card-list">
                                {card.features.map((f, idx) => (
                                    <li key={idx} className="supervision-card-list-item">
                                        <svg className="supervision-card-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SupervisionSection
