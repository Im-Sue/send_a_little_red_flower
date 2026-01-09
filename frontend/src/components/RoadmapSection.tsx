function RoadmapSection() {
    const roadmapItems = [
        { time: "MVP 阶段", title: "黑客松演示", desc: "跨链捐款功能 + 小红花 NFT 发放", active: true },
        { time: "V1.0 (+1月)", title: "多链支持", desc: "支持更多平行链 + 事件自主创建功能", active: false },
        { time: "V2.0 (+3月)", title: "隐私升级", desc: "集成 ZK 隐私证明 + 多签监管面板", active: false },
        { time: "V3.0 (+6月)", title: "DAO & 生态", desc: "社区化治理 + 实体公益机构合作", active: false },
    ]

    const faqItems = [
        {
            q: "资金如果被恶意挪用怎么办？",
            a: "多层防护：资金始终托管在智能合约中，大额转账有时间锁冷却期，且需要监管节点多签批准。如有异常，可触发保险基金赔付。"
        },
        {
            q: "小红花代币有什么价值？",
            a: "小红花是'社会影响力凭证' (SBT)。它用于链上荣誉展示、DAO 治理权重，未来生态合作项目也会给予持有者空投福利。"
        },
        {
            q: "为什么不直接用以太坊？",
            a: "Cost & Interoperability。以太坊 Gas 费对于小额捐赠是巨大的阻碍。Polkadot 原生跨链不仅便宜，还能安全地连接不同共识的链。"
        }
    ]

    return (
        <section id="qa" className="section roadmap-section">
            <div className="container">
                <div className="roadmap-grid">
                    {/* Roadmap */}
                    <div>
                        <span className="badge">未来规划</span>
                        <h2 className="section-title" style={{ marginBottom: '2rem' }}>路线图</h2>
                        <div className="roadmap-timeline">
                            {roadmapItems.map((item, i) => (
                                <div key={i} className="roadmap-item">
                                    <span className={`roadmap-dot ${item.active ? 'roadmap-dot-active' : ''}`}></span>
                                    <span className="roadmap-time">{item.time}</span>
                                    <h4 className="roadmap-title">{item.title}</h4>
                                    <p className="roadmap-desc">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div>
                        <span className="badge">Q & A</span>
                        <h2 className="section-title" style={{ marginBottom: '2rem' }}>评审员常见问题</h2>
                        <div className="faq-list">
                            {faqItems.map((item, i) => (
                                <div key={i} className="faq-item">
                                    <h4 className="faq-question">
                                        <svg className="faq-question-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                        {item.q}
                                    </h4>
                                    <p className="faq-answer">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RoadmapSection
