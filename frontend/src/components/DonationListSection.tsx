import DonationStats from './DonationStats'
import DonationCard from './DonationCard'
import { mockDonations, mockStats } from '../data/mockDonations'

function DonationListSection() {
    return (
        <section id="donations" className="section donation-list-section">
            <div className="container">
                {/* Header */}
                <div className="section-header">
                    <span className="badge">透明公示</span>
                    <h2 className="section-title">
                        💝 <span className="gradient-rose">爱心公示墙</span>
                    </h2>
                    <p className="section-subtitle">
                        每一份善意都值得被铭记，每一笔捐款都公开透明
                    </p>
                </div>

                {/* Stats */}
                <DonationStats
                    totalAmount={mockStats.totalAmount}
                    donationCount={mockStats.donationCount}
                    totalFlowers={mockStats.totalFlowers}
                    uniqueDonors={mockStats.uniqueDonors}
                />

                {/* Donation List */}
                <div className="donation-list-container">
                    <div className="donation-list-header">
                        <h3 className="donation-list-title">最近捐赠</h3>
                        <span className="donation-list-count">{mockDonations.length} 笔记录</span>
                    </div>

                    <div className="donation-list-grid">
                        {mockDonations.map((donation) => (
                            <DonationCard key={donation.id} donation={donation} />
                        ))}
                    </div>

                    {/* Empty State (hidden when there are donations) */}
                    {mockDonations.length === 0 && (
                        <div className="donation-empty-state">
                            <div className="donation-empty-icon">🌸</div>
                            <h4>还没有捐赠记录</h4>
                            <p>成为第一个献出爱心的人吧！</p>
                            <button className="btn-primary">💝 立即捐款</button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default DonationListSection
