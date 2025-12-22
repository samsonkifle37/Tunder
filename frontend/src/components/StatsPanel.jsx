import React from 'react';

const StatsPanel = ({ stats }) => {
    return (
        <div className="stats-panel">
            <h2>🔥 Hot & ❄️ Cold</h2>
            <div className="stats-grid">
                <div className="stat-group">
                    <h3>Hot Main (Top 5)</h3>
                    <div className="number-list hot">
                        {stats.mainstats.hot.map(n => (
                            <span key={n.number} className="ball hot-ball">{n.number}</span>
                        ))}
                    </div>
                </div>
                <div className="stat-group">
                    <h3>Cold Main (Bottom 5)</h3>
                    <div className="number-list cold">
                        {stats.mainstats.cold.map(n => (
                            <span key={n.number} className="ball cold-ball">{n.number}</span>
                        ))}
                    </div>
                </div>
                <div className="stat-group">
                    <h3>Hot Thunderballs</h3>
                    <div className="number-list hot">
                        {stats.thunderballStats.hot.map(n => (
                            <span key={n.number} className="ball thunder-ball hot-ball">{n.number}</span>
                        ))}
                    </div>
                </div>
                <div className="stat-group">
                    <h3>Cold Thunderballs</h3>
                    <div className="number-list cold">
                        {stats.thunderballStats.cold.map(n => (
                            <span key={n.number} className="ball thunder-ball cold-ball">{n.number}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsPanel;
