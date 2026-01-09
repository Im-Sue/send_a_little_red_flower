interface StatsCardProps {
    icon: React.ReactNode
    label: string
    value: string | number
    suffix?: string
}

function StatsCard({ icon, label, value, suffix }: StatsCardProps) {
    return (
        <div className="donation-stats-card">
            <div className="donation-stats-icon">{icon}</div>
            <div className="donation-stats-content">
                <span className="donation-stats-value">
                    {value}
                    {suffix && <span className="donation-stats-suffix">{suffix}</span>}
                </span>
                <span className="donation-stats-label">{label}</span>
            </div>
        </div>
    )
}

interface DonationStatsProps {
    totalAmount: number
    donationCount: number
    totalFlowers: number
    uniqueDonors: number
}

function DonationStats({ totalAmount, donationCount, totalFlowers, uniqueDonors }: DonationStatsProps) {
    return (
        <div className="donation-stats-grid">
            <StatsCard
                icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                }
                label="累计捐款"
                value={`$${totalAmount.toLocaleString()}`}
            />
            <StatsCard
                icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                }
                label="捐赠人次"
                value={donationCount}
                suffix="笔"
            />
            <StatsCard
                icon={
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                }
                label="小红花总量"
                value={totalFlowers.toLocaleString()}
                suffix="🌸"
            />
            <StatsCard
                icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                }
                label="参与地址"
                value={uniqueDonors}
                suffix="个"
            />
        </div>
    )
}

export default DonationStats
