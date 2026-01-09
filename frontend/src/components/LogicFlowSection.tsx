function LogicFlowSection() {
    const steps = [
        { icon: "users", title: "募集", status: "锁定中", desc: "用户跨链捐赠，资金锁定在智能合约" },
        { icon: "eye", title: "待分配", status: "验证中", desc: "达到目标，等待监管节点与社区验证" },
        { icon: "zap", title: "分配中", status: "分批释放", desc: "按里程碑释放资金，确保专款专用" },
        { icon: "check", title: "已完成", status: "透明归档", desc: "资金使用完毕，生成永久链上报告" }
    ]

    const getIcon = (name: string) => {
        switch (name) {
            case 'users':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                )
            case 'eye':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )
            case 'zap':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                )
            case 'check':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <section id="logic" className="section logic-section">
            <div className="container">
                <div className="section-header">
                    <span className="badge">业务全景</span>
                    <h2 className="section-title">善款如何透明流转？</h2>
                </div>

                <div className="logic-flow">
                    <div className="logic-flow-line"></div>
                    <div className="logic-flow-grid">
                        {steps.map((step, index) => (
                            <div key={index} className="logic-step">
                                <div className="logic-step-icon">
                                    {getIcon(step.icon)}
                                </div>
                                <h3 className="logic-step-title">{step.title}</h3>
                                <span className="logic-step-status">{step.status}</span>
                                <p className="logic-step-desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ZK Section */}
                <div className="zk-section">
                    <div className="zk-glow"></div>
                    <div className="zk-content">
                        <div>
                            <h3 className="zk-title">
                                <svg className="zk-title-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                ZK 零知识证明隐私保护
                            </h3>
                            <p className="zk-text">
                                我们理解慈善需要透明，但也需要保护隐私。通过 Zero-Knowledge Proof 技术，
                                捐赠者可以证明捐款金额符合区间而不暴露具体数字；
                                受助方可以证明符合困难资质而不暴露过多个人隐私。
                            </p>
                            <ul className="zk-list">
                                <li className="zk-list-item">
                                    <span className="zk-list-dot"></span>
                                    捐赠者身份匿名化
                                </li>
                                <li className="zk-list-item">
                                    <span className="zk-list-dot"></span>
                                    资金合规性审计
                                </li>
                            </ul>
                        </div>
                        <div className="zk-demo">
                            <div className="zk-demo-row">
                                <span className="zk-demo-label">原始数据</span>
                                <span className="zk-demo-value zk-demo-value-rose">Alice donated 1000 DOT</span>
                            </div>
                            <div className="zk-demo-arrow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M19 12l-7 7-7-7" />
                                </svg>
                            </div>
                            <div className="zk-demo-row">
                                <span className="zk-demo-label">链上验证</span>
                                <span className="zk-demo-value zk-demo-value-green">Proof Valid (Amount &gt; 0)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LogicFlowSection
