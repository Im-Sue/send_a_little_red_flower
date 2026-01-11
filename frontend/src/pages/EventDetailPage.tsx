import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BrowserProvider, Contract, parseUnits, formatUnits } from 'ethers'
import { mockEvents, categoryConfig, type DonationEvent } from '../data/mockEvents'
import { mockDonations, type Donation } from '../data/mockDonations'
import DonationCard from '../components/DonationCard'
import { useWallet } from '../contexts/WalletContext'
import { ETHEREUM_SEPOLIA, FLOWER_RATIO, CROSS_CHAIN_FEE } from '../contracts/config'
import { TOKEN_BRIDGE_ABI, ERC20_ABI } from '../contracts/abis'
import { getEvent, getEventDonations, getFlowerBalance } from '../services/donationVaultService'

// 交易状态类型
type TxStatus = 'idle' | 'approving' | 'donating' | 'success' | 'error'

// Calculate progress percentage
function calculateProgress(current: number, target: number): number {
    return Math.min(Math.round((current / target) * 100), 100)
}

// Format deadline
function formatDeadline(deadline: Date): { text: string; daysLeft: number; isUrgent: boolean } {
    const now = new Date()
    const diffMs = deadline.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffDays < 0) return { text: '已截止', daysLeft: 0, isUrgent: false }
    if (diffDays === 0) return { text: '今天截止', daysLeft: 0, isUrgent: true }
    if (diffDays <= 3) return { text: `剩余 ${diffDays} 天`, daysLeft: diffDays, isUrgent: true }
    return { text: `剩余 ${diffDays} 天`, daysLeft: diffDays, isUrgent: false }
}

// Format currency
function formatAmount(amount: number): string {
    if (amount >= 10000) {
        return `$${(amount / 10000).toFixed(2)}万`
    }
    return `$${amount.toLocaleString()}`
}

// Format address
function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Mock images for the event gallery - 山区儿童教育主题图片
const mockEventImages = [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop', // 学习的孩子们
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop', // 书本和教育
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop', // 教室场景
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=400&fit=crop', // 希望与未来
]

function EventDetailPage() {
    const { eventId } = useParams<{ eventId: string }>()
    const navigate = useNavigate()
    const { address, isConnected, connect, chainId, switchToSepolia } = useWallet()

    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0)

    // Donation form state
    const [donationAmount, setDonationAmount] = useState('')

    // Transaction state
    const [txStatus, setTxStatus] = useState<TxStatus>('idle')
    const [txHash, setTxHash] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // 链上数据状态
    const [onChainEvent, setOnChainEvent] = useState<any>(null)
    const [onChainDonations, setOnChainDonations] = useState<Donation[]>([])
    const [flowerBalance, setFlowerBalance] = useState<string>('0')
    const [isLoadingChainData, setIsLoadingChainData] = useState(true)

    const quickAmounts = [10, 50, 100, 500]

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? mockEventImages.length - 1 : prev - 1))
    }

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev === mockEventImages.length - 1 ? 0 : prev + 1))
    }

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
    }

    // 处理捐款
    const handleDonate = async () => {
        if (!donationAmount || !isConnected || !address) {
            if (!isConnected) {
                await connect()
            }
            return
        }

        // 检查是否在 ETH Sepolia 网络
        const SEPOLIA_CHAIN_ID = '0xaa36a7' // 11155111
        if (chainId !== SEPOLIA_CHAIN_ID) {
            await switchToSepolia()
            return
        }

        try {
            setTxStatus('approving')
            setErrorMessage(null)
            setTxHash(null)

            const provider = new BrowserProvider(window.ethereum!)
            const signer = await provider.getSigner()

            // 金额转换 (假设 USDT 是 18 decimals，mock token)
            const amountWei = parseUnits(donationAmount, 18)

            // Step 1: Approve USDT
            const usdtContract = new Contract(
                ETHEREUM_SEPOLIA.contracts.mockUSDT,
                ERC20_ABI,
                signer
            )

            console.log('Approving USDT...', {
                spender: ETHEREUM_SEPOLIA.contracts.tokenBridge,
                amount: amountWei.toString()
            })

            const approveTx = await usdtContract.approve(
                ETHEREUM_SEPOLIA.contracts.tokenBridge,
                amountWei
            )
            await approveTx.wait()
            console.log('Approve confirmed:', approveTx.hash)

            // Step 2: Call TokenBridge.donate()
            setTxStatus('donating')

            const tokenBridgeContract = new Contract(
                ETHEREUM_SEPOLIA.contracts.tokenBridge,
                TOKEN_BRIDGE_ABI,
                signer
            )

            console.log('Donating...', {
                token: ETHEREUM_SEPOLIA.contracts.mockUSDT,
                amount: amountWei.toString()
            })

            // 使用不带 eventId 的 donate 方法（使用合约的 defaultEventId）
            const donateTx = await tokenBridgeContract['donate(address,uint256)'](
                ETHEREUM_SEPOLIA.contracts.mockUSDT,
                amountWei
            )

            setTxHash(donateTx.hash)
            await donateTx.wait()

            console.log('Donation confirmed:', donateTx.hash)
            setTxStatus('success')
            setDonationAmount('')

        } catch (error: unknown) {
            console.error('Donation failed:', error)
            setTxStatus('error')
            if (error instanceof Error) {
                setErrorMessage(error.message.slice(0, 100))
            } else {
                setErrorMessage('交易失败，请重试')
            }
        }
    }

    // 获取按钮文本
    const getDonateButtonText = () => {
        if (!isConnected) return '🔗 连接钱包'
        if (txStatus === 'approving') return '⏳ 授权中...'
        if (txStatus === 'donating') return '⏳ 捐款中...'
        if (txStatus === 'success') return '✅ 捐款成功！'
        if (txStatus === 'error') return '❌ 重试'
        if (donationAmount) {
            const flowers = Number(donationAmount) * FLOWER_RATIO
            return `💝 捐款 $${donationAmount} (获得 ${flowers} FLOWER)`
        }
        return '💝 立即捐款'
    }

    // 从链上加载事件数据
    useEffect(() => {
        const loadChainData = async () => {
            if (!eventId) return

            setIsLoadingChainData(true)
            try {
                // 获取事件详情
                const chainEvent = await getEvent(Number(eventId))
                if (chainEvent) {
                    setOnChainEvent(chainEvent)
                }

                // 获取捐款记录
                const chainDonations = await getEventDonations(Number(eventId))
                if (chainDonations.length > 0) {
                    // 转换为前端格式
                    const formattedDonations: Donation[] = chainDonations.map((d, index) => ({
                        id: `chain-${index}`,
                        donor: d.donor,
                        amount: Number(formatUnits(d.amount, 18)),
                        tokenSymbol: 'USDT',
                        flowersReceived: Number(formatUnits(d.flowersReceived, 18)),
                        timestamp: new Date(Number(d.timestamp) * 1000),
                        eventId: Number(eventId),
                        eventTitle: '山区儿童教育基金',
                        sourceChain: 'Ethereum Sepolia',
                        targetChain: 'Arbitrum Sepolia',
                        status: 'completed' as const,
                        txHash: '0x...' // 链上没有存储交易哈希
                    }))
                    setOnChainDonations(formattedDonations)
                }
            } catch (error) {
                console.error('Failed to load chain data:', error)
            } finally {
                setIsLoadingChainData(false)
            }
        }

        loadChainData()
    }, [eventId])

    // 获取用户 FLOWER 余额
    useEffect(() => {
        const loadFlowerBalance = async () => {
            if (!address) {
                setFlowerBalance('0')
                return
            }

            try {
                const balance = await getFlowerBalance(address)
                setFlowerBalance(formatUnits(balance, 18))
            } catch (error) {
                console.error('Failed to load FLOWER balance:', error)
            }
        }

        loadFlowerBalance()
    }, [address, txStatus]) // txStatus 变化时重新获取（捐款成功后）

    // Find the event (从 mock 获取基础数据)
    const baseEvent: DonationEvent | undefined = mockEvents.find(e => e.id === Number(eventId))

    // 合并链上数据和 mock 数据
    const event: DonationEvent | undefined = baseEvent && onChainEvent ? {
        ...baseEvent,
        targetAmount: Number(formatUnits(onChainEvent.targetAmount, 18)),
        currentAmount: Number(formatUnits(onChainEvent.currentAmount, 18)),
        deadline: new Date(Number(onChainEvent.deadline) * 1000),
        isActive: onChainEvent.isActive
    } : baseEvent

    // 调试日志
    if (onChainEvent) {
        console.log('📊 [EventDetailPage] 数据合并:')
        console.log('  - baseEvent:', baseEvent)
        console.log('  - onChainEvent:', onChainEvent)
        console.log('  - 合并后 targetAmount:', event?.targetAmount)
        console.log('  - 合并后 currentAmount:', event?.currentAmount)
        console.log('  - 合并后 deadline:', event?.deadline)
    }

    // 使用链上捐款记录，如果没有则使用 mock
    const eventDonations = onChainDonations.length > 0
        ? onChainDonations
        : mockDonations.filter(d => d.eventId === Number(eventId))

    // Handle event not found
    if (!event) {
        return (
            <main className="event-detail-page">
                <div className="event-detail-not-found">
                    <div className="event-detail-not-found-icon">🔍</div>
                    <h2>事件未找到</h2>
                    <p>您访问的捐助事件不存在或已被移除</p>
                    <button className="btn-primary" onClick={() => navigate('/donations')}>
                        返回事件列表
                    </button>
                </div>
            </main>
        )
    }

    const progress = calculateProgress(event.currentAmount, event.targetAmount)
    const deadline = formatDeadline(event.deadline)
    const category = categoryConfig[event.category]
    const isCompleted = event.currentAmount >= event.targetAmount

    return (
        <main className="event-detail-page">
            {/* Hero Section with Back Button and Title */}
            <section className="event-detail-hero">
                <div className="container">
                    {/* Back Button */}
                    <button className="event-detail-back-btn" onClick={() => navigate(-1)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        返回
                    </button>

                    {/* Header with Title and Badges on same line */}
                    <div className="event-detail-header">
                        <h1 className="event-detail-title">{event.title}</h1>
                        <div className="event-detail-badges">
                            <span
                                className="event-category-badge"
                                style={{ backgroundColor: `${category.color}15`, color: category.color }}
                            >
                                {category.label}
                            </span>
                            {isCompleted ? (
                                <span className="event-status-badge event-status-completed">✓ 已达成</span>
                            ) : event.isActive ? (
                                <span className="event-status-badge event-status-active">进行中</span>
                            ) : (
                                <span className="event-status-badge event-status-ended">已结束</span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area with Image Gallery and Floating Sidebar */}
            <section className="event-detail-content">
                <div className="container">
                    <div className="event-detail-layout">
                        {/* Left Column - Image Gallery and Details */}
                        <div className="event-detail-main-column">
                            {/* Image Carousel */}
                            <div className="event-detail-carousel">
                                <div className="carousel-viewport">
                                    <div
                                        className="carousel-track"
                                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                    >
                                        {mockEventImages.map((img, index) => (
                                            <div key={index} className="carousel-slide">
                                                <img src={img} alt={`${event.title} - 图片 ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <button className="carousel-btn carousel-btn-prev" onClick={goToPrevSlide}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </button>
                                <button className="carousel-btn carousel-btn-next" onClick={goToNextSlide}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>

                                {/* Indicator Dots */}
                                <div className="carousel-indicators">
                                    {mockEventImages.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                                            onClick={() => goToSlide(index)}
                                            aria-label={`跳转到图片 ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                {/* Slide Counter */}
                                <div className="carousel-counter">
                                    {currentSlide + 1} / {mockEventImages.length}
                                </div>
                            </div>

                            {/* Event Description Card */}
                            <div className="event-detail-info-card">
                                <h3 className="event-detail-card-title">📋 事件详情</h3>

                                {/* 项目背景 */}
                                <div className="event-detail-section">
                                    <h4 className="event-detail-sub-title">📍 项目背景</h4>
                                    <p className="event-detail-description">
                                        云贵高原偏远山区的孩子们面临着严峻的教育资源匮乏问题。在海拔2800米的大山深处，
                                        有一所名为"云贵希望小学"的学校，这里有超过500名学龄儿童，却只有一所破旧的教学楼和3名支教老师。
                                    </p>
                                    <p className="event-detail-description">
                                        孩子们每天需要翻山越岭步行2小时才能到达学校，冬天的教室没有取暖设备，
                                        课本和文具极度匮乏。尽管条件艰苦，孩子们对知识的渴望从未减退。
                                        他们的眼神中闪烁着对未来的希望，让我们一起为他们点亮求学之路！
                                    </p>
                                </div>

                                {/* 资金用途 */}
                                <div className="event-detail-section">
                                    <h4 className="event-detail-sub-title">💰 资金用途</h4>
                                    <div className="fund-usage-tags">
                                        <span className="fund-tag fund-tag-primary">📚 教材课本 - 40%</span>
                                        <span className="fund-tag fund-tag-secondary">✏️ 学习用品 - 20%</span>
                                        <span className="fund-tag fund-tag-tertiary">🏫 教室修缮 - 15%</span>
                                        <span className="fund-tag fund-tag-quaternary">👨‍🏫 师资补贴 - 15%</span>
                                        <span className="fund-tag fund-tag-quinary">💻 数字设备 - 10%</span>
                                    </div>
                                    <p className="event-detail-description" style={{ marginTop: '1rem' }}>
                                        我们将为孩子们购买全新的课本和学习用品，改善教室的基础设施，
                                        为坚守岗位的支教老师提供生活补贴，并逐步建立数字化教学环境，
                                        让山区孩子也能享受到优质的教育资源。
                                    </p>
                                </div>

                                {/* 受助群体 */}
                                <div className="event-detail-section">
                                    <h4 className="event-detail-sub-title">👧 受助群体</h4>
                                    <div className="beneficiary-stats">
                                        <div className="stat-item">
                                            <span className="stat-number">500+</span>
                                            <span className="stat-label">学龄儿童</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">6-15</span>
                                            <span className="stat-label">年龄范围</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">12</span>
                                            <span className="stat-label">覆盖村落</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">3</span>
                                            <span className="stat-label">支教老师</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 项目承诺 */}
                                <div className="event-detail-section">
                                    <h4 className="event-detail-sub-title">🔒 项目承诺</h4>
                                    <div className="commitment-list">
                                        <div className="commitment-item">
                                            <span className="commitment-icon">✅</span>
                                            <span>所有捐款通过 Hyperbridge 跨链协议安全转账</span>
                                        </div>
                                        <div className="commitment-item">
                                            <span className="commitment-icon">✅</span>
                                            <span>资金使用全程透明，链上可追溯</span>
                                        </div>
                                        <div className="commitment-item">
                                            <span className="commitment-icon">✅</span>
                                            <span>定期公示项目进展和受助情况</span>
                                        </div>
                                        <div className="commitment-item">
                                            <span className="commitment-icon">✅</span>
                                            <span>捐款者获得小红花代币作为爱心凭证</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Beneficiary Info */}
                                <div className="event-detail-beneficiary-section">
                                    <h4 className="event-detail-sub-title">👤 受助方信息</h4>
                                    <div className="event-detail-beneficiary">
                                        <div className="beneficiary-avatar">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <div className="beneficiary-info">
                                            <span className="beneficiary-name">{event.beneficiaryName}</span>
                                            <span className="beneficiary-address">
                                                📍 {formatAddress(event.beneficiary)}
                                                <button
                                                    className="copy-btn"
                                                    onClick={() => navigator.clipboard.writeText(event.beneficiary)}
                                                    title="复制地址"
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Workflow */}
                                <div className="event-detail-workflow-section">
                                    <h4 className="event-detail-sub-title">📋 项目流程</h4>
                                    <div className="workflow-steps">
                                        <div className="workflow-step completed">
                                            <div className="step-icon">✓</div>
                                            <div className="step-content">
                                                <span className="step-title">项目发起</span>
                                                <span className="step-desc">受助方提交申请并审核通过</span>
                                            </div>
                                        </div>
                                        <div className="workflow-step completed">
                                            <div className="step-icon">✓</div>
                                            <div className="step-content">
                                                <span className="step-title">资料核实</span>
                                                <span className="step-desc">平台验证受助方身份和情况</span>
                                            </div>
                                        </div>
                                        <div className="workflow-step active">
                                            <div className="step-icon">3</div>
                                            <div className="step-content">
                                                <span className="step-title">募捐进行中</span>
                                                <span className="step-desc">接受跨链捐款</span>
                                            </div>
                                        </div>
                                        <div className="workflow-step">
                                            <div className="step-icon">4</div>
                                            <div className="step-content">
                                                <span className="step-title">拨付前核实</span>
                                                <span className="step-desc">平台核实受助方最新情况</span>
                                            </div>
                                        </div>
                                        <div className="workflow-step">
                                            <div className="step-icon">5</div>
                                            <div className="step-content">
                                                <span className="step-title">资金拨付</span>
                                                <span className="step-desc">资金转入受助方账户</span>
                                            </div>
                                        </div>
                                        <div className="workflow-step">
                                            <div className="step-icon">6</div>
                                            <div className="step-content">
                                                <span className="step-title">进展公示</span>
                                                <span className="step-desc">公开资金使用情况</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Floating Donate Card */}
                        <div className="event-detail-sidebar-column">
                            <div className="event-detail-donate-card">
                                {/* FLOWER Balance (if connected) */}
                                {isConnected && address && (
                                    <div className="flower-balance-section">
                                        <div className="flower-balance-label">🌸 我的小红花</div>
                                        <div className="flower-balance-amount">
                                            {Number(flowerBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} FLOWER
                                        </div>
                                    </div>
                                )}

                                {/* Progress Section */}
                                <div className="donate-card-progress">
                                    {isLoadingChainData ? (
                                        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-gray-400)' }}>
                                            ⏳ 加载链上数据...
                                        </div>
                                    ) : (
                                        <>
                                            <div className="donate-card-progress-header">
                                                <span className="donate-card-amount-current">{formatAmount(event.currentAmount)}</span>
                                                <span className={`donate-card-percent ${isCompleted ? 'completed' : ''}`}>
                                                    {progress}%
                                                </span>
                                            </div>
                                            <div className="donate-card-progress-bar-container">
                                                <div
                                                    className="donate-card-progress-bar"
                                                    style={{
                                                        width: `${progress}%`,
                                                        background: isCompleted
                                                            ? 'linear-gradient(to right, #22c55e, #16a34a)'
                                                            : 'linear-gradient(to right, #f43f5e, #db2777)'
                                                    }}
                                                />
                                            </div>
                                            <div className="donate-card-target">
                                                目标 {formatAmount(event.targetAmount)}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="donate-card-stats">
                                    <div className="donate-card-stat">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                        <span>{event.donorCount} 人参与</span>
                                    </div>
                                    <div className={`donate-card-stat ${deadline.isUrgent ? 'urgent' : ''}`}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span>{deadline.text}</span>
                                    </div>
                                </div>

                                {/* Deadline Date */}
                                <div className="donate-card-deadline">
                                    截止日期：{event.deadline.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>

                                {/* Chain Info - 仅支持 ETH Sepolia */}
                                {event.isActive && !isCompleted && (
                                    <div className="donate-form">
                                        <div className="donate-form-section">
                                            <label className="donate-form-label">支付链</label>
                                            <div className="chain-selector">
                                                <button className="chain-option active">
                                                    <span className="chain-icon">🔷</span>
                                                    <span className="chain-name">Ethereum Sepolia</span>
                                                </button>
                                            </div>
                                            <div className="chain-info-text">
                                                跨链费用约 {CROSS_CHAIN_FEE} USD.h
                                            </div>
                                        </div>

                                        <div className="donate-form-section">
                                            <label className="donate-form-label">捐款金额 (USDT)</label>
                                            <div className="amount-input-wrapper">
                                                <input
                                                    type="number"
                                                    className="amount-input"
                                                    placeholder="输入金额"
                                                    value={donationAmount}
                                                    onChange={(e) => setDonationAmount(e.target.value)}
                                                />
                                            </div>
                                            <div className="quick-amounts">
                                                {quickAmounts.map(amount => (
                                                    <button
                                                        key={amount}
                                                        className={`quick-amount-btn ${donationAmount === String(amount) ? 'active' : ''}`}
                                                        onClick={() => setDonationAmount(String(amount))}
                                                    >
                                                        ${amount}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Donate Button */}
                                {event.isActive && !isCompleted ? (
                                    <>
                                        <button
                                            className={`donate-card-btn ${txStatus === 'success' ? 'success' : ''} ${txStatus === 'error' ? 'error' : ''}`}
                                            disabled={txStatus === 'approving' || txStatus === 'donating' || (!donationAmount && isConnected)}
                                            onClick={handleDonate}
                                        >
                                            {getDonateButtonText()}
                                        </button>
                                        {/* Transaction Hash */}
                                        {txHash && (
                                            <div className="tx-hash-link">
                                                <a
                                                    href={`${ETHEREUM_SEPOLIA.explorer}/tx/${txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    查看交易 ↗
                                                </a>
                                            </div>
                                        )}
                                        {/* Error Message */}
                                        {errorMessage && (
                                            <div className="tx-error-message">
                                                {errorMessage}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button className="donate-card-btn disabled" disabled>
                                        {isCompleted ? '🌸 目标已达成' : '已结束'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Horizontal Donation Records */}
            <section className="event-detail-donations-section">
                <div className="container">
                    <div className="event-detail-donations-header">
                        <h3 className="event-detail-section-title">🌸 捐款记录</h3>
                        <span className="event-detail-donations-count">{eventDonations.length} 笔</span>
                    </div>

                    {eventDonations.length > 0 ? (
                        <div className="event-detail-donations-scroll">
                            {eventDonations.map(donation => (
                                <div key={donation.id} className="event-detail-donation-item">
                                    <DonationCard donation={donation} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="event-detail-donations-empty">
                            <div className="empty-icon">🌱</div>
                            <p>暂无捐款记录</p>
                            <span>成为第一个捐助者吧！</span>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default EventDetailPage
