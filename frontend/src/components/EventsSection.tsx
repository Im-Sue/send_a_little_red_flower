import EventCard from './EventCard'
import { mockEvents } from '../data/mockEvents'

function EventsSection() {
    const activeEvents = mockEvents.filter(e => e.isActive)
    const completedEvents = mockEvents.filter(e => !e.isActive || e.currentAmount >= e.targetAmount)

    return (
        <section id="events" className="section events-section">
            <div className="container">
                {/* Header */}
                <div className="section-header">
                    <span className="badge">救助项目</span>
                    <h2 className="section-title">
                        🏥 <span className="gradient-rose">待捐助事件</span>
                    </h2>
                    <p className="section-subtitle">
                        每一份善意都能改变一个人的命运，选择你想支持的项目
                    </p>
                </div>

                {/* Active Events */}
                {activeEvents.length > 0 && (
                    <div className="events-group">
                        <div className="events-group-header">
                            <h3 className="events-group-title">
                                <span className="events-group-dot events-group-dot-active"></span>
                                进行中的项目
                            </h3>
                            <span className="events-group-count">{activeEvents.length} 个</span>
                        </div>
                        <div className="events-grid">
                            {activeEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Events */}
                {completedEvents.length > 0 && (
                    <div className="events-group events-group-completed">
                        <div className="events-group-header">
                            <h3 className="events-group-title">
                                <span className="events-group-dot events-group-dot-completed"></span>
                                已完成的项目
                            </h3>
                            <span className="events-group-count">{completedEvents.length} 个</span>
                        </div>
                        <div className="events-grid">
                            {completedEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {mockEvents.length === 0 && (
                    <div className="events-empty-state">
                        <div className="events-empty-icon">🏥</div>
                        <h4>暂无救助项目</h4>
                        <p>目前没有需要帮助的项目，感谢您的关注</p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default EventsSection
