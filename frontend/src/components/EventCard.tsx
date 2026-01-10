import { Link } from 'react-router-dom'
import type { DonationEvent } from '../data/mockEvents'
import { categoryConfig } from '../data/mockEvents'

interface EventCardProps {
    event: DonationEvent
}

// Calculate progress percentage
function calculateProgress(current: number, target: number): number {
    return Math.min(Math.round((current / target) * 100), 100)
}

// Format deadline as countdown or date
function formatDeadline(deadline: Date): { text: string; isUrgent: boolean } {
    const now = new Date()
    const diffMs = deadline.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffDays < 0) return { text: '已截止', isUrgent: false }
    if (diffDays === 0) return { text: '今天截止', isUrgent: true }
    if (diffDays <= 3) return { text: `剩余 ${diffDays} 天`, isUrgent: true }
    if (diffDays <= 7) return { text: `剩余 ${diffDays} 天`, isUrgent: false }
    return { text: deadline.toLocaleDateString('zh-CN'), isUrgent: false }
}

// Format currency
function formatAmount(amount: number): string {
    if (amount >= 10000) {
        return `$${(amount / 10000).toFixed(1)}万`
    }
    return `$${amount.toLocaleString()}`
}

function EventCard({ event }: EventCardProps) {
    const progress = calculateProgress(event.currentAmount, event.targetAmount)
    const deadline = formatDeadline(event.deadline)
    const category = categoryConfig[event.category]
    const isCompleted = event.currentAmount >= event.targetAmount

    return (
        <div className={`event-card ${!event.isActive ? 'event-card-inactive' : ''}`}>
            {/* Category Badge */}
            <div className="event-card-header">
                <span
                    className="event-category-badge"
                    style={{ backgroundColor: `${category.color}15`, color: category.color }}
                >
                    {category.label}
                </span>
                {isCompleted && (
                    <span className="event-status-badge event-status-completed">
                        ✓ 已达成
                    </span>
                )}
                {!event.isActive && !isCompleted && (
                    <span className="event-status-badge event-status-ended">
                        已结束
                    </span>
                )}
            </div>

            {/* Title & Description - Clickable Link */}
            <Link to="/event/1" className="event-card-link">
                <h3 className="event-card-title">{event.title}</h3>
            </Link>
            <p className="event-card-desc">{event.description}</p>

            {/* Progress Section */}
            <div className="event-progress-section">
                <div className="event-progress-bar-container">
                    <div
                        className="event-progress-bar"
                        style={{
                            width: `${progress}%`,
                            background: isCompleted
                                ? 'linear-gradient(to right, #22c55e, #16a34a)'
                                : 'linear-gradient(to right, #f43f5e, #db2777)'
                        }}
                    />
                </div>
                <div className="event-progress-info">
                    <div className="event-progress-amounts">
                        <span className="event-progress-current">{formatAmount(event.currentAmount)}</span>
                        <span className="event-progress-divider">/</span>
                        <span className="event-progress-target">{formatAmount(event.targetAmount)}</span>
                    </div>
                    <span className="event-progress-percent">{progress}%</span>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="event-card-footer">
                <div className="event-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>{event.donorCount} 人参与</span>
                </div>
                <div className={`event-stat ${deadline.isUrgent ? 'event-stat-urgent' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{deadline.text}</span>
                </div>
            </div>

            {/* Action Button */}
            {event.isActive && !isCompleted ? (
                <button className="event-donate-btn">
                    💝 立即捐款
                </button>
            ) : (
                <button className="event-donate-btn event-donate-btn-disabled" disabled>
                    {isCompleted ? '🌸 感谢支持' : '已结束'}
                </button>
            )}
        </div>
    )
}

export default EventCard
