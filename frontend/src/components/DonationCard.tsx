import type { Donation } from '../data/mockDonations'

interface DonationCardProps {
    donation: Donation
}

// Format address to show first 6 and last 4 characters
function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Format relative time
function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins} 分钟前`
    if (diffHours < 24) return `${diffHours} 小时前`
    return `${diffDays} 天前`
}

// Get status badge class and text
function getStatusInfo(status: Donation['status']): { className: string; text: string } {
    switch (status) {
        case 'pending':
            return { className: 'donation-status-pending', text: '跨链中...' }
        case 'confirmed':
            return { className: 'donation-status-confirmed', text: '已确认' }
        case 'completed':
            return { className: 'donation-status-completed', text: '已完成' }
    }
}

function DonationCard({ donation }: DonationCardProps) {
    const statusInfo = getStatusInfo(donation.status)

    return (
        <div className="donation-card">
            <div className="donation-card-header">
                <div className="donation-card-avatar">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </div>
                <div className="donation-card-info">
                    <span className="donation-card-address">{formatAddress(donation.donor)}</span>
                    <span className="donation-card-time">{formatRelativeTime(donation.timestamp)}</span>
                </div>
                <span className={`donation-status ${statusInfo.className}`}>{statusInfo.text}</span>
            </div>

            <div className="donation-card-body">
                <div className="donation-card-amount-row">
                    <div className="donation-card-amount">
                        <span className="donation-amount-label">💰</span>
                        <span className="donation-amount-value">{donation.amount} {donation.tokenSymbol}</span>
                    </div>
                    <span className="donation-card-arrow">→</span>
                    <div className="donation-card-flowers">
                        <span className="donation-flowers-value">🌸 {donation.flowersReceived.toLocaleString()}</span>
                        <span className="donation-flowers-label">小红花</span>
                    </div>
                </div>
            </div>

            <div className="donation-card-footer">
                <div className="donation-card-chain">
                    <span className="donation-chain-badge">{donation.sourceChain}</span>
                    <span className="donation-chain-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </span>
                    <span className="donation-chain-badge donation-chain-target">{donation.targetChain}</span>
                </div>
                <a
                    href={`https://sepolia.etherscan.io/tx/${donation.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="donation-card-tx-link"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                    查看交易
                </a>
            </div>

            <div className="donation-card-event">
                支持事件: <span>{donation.eventTitle}</span>
            </div>
        </div>
    )
}

export default DonationCard
