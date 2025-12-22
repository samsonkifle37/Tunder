import React from 'react';

const ReferenceDraws = ({ draws }) => {
    if (!draws || draws.length === 0) return null;

    return (
        <div className="reference-draws">
            <h3>📅 Recent Draws</h3>
            <ul className="draw-list">
                {draws.map((draw) => (
                    <li key={draw.drawId} className="draw-item">
                        <div className="draw-info">
                            <span className="draw-date">{draw.date}</span>
                            <span className="draw-id">#{draw.drawId}</span>
                        </div>
                        <div className="draw-numbers">
                            {draw.numbers.map((num) => (
                                <span key={num} className="ball main-ball small">{num}</span>
                            ))}
                            <span className="ball thunder-ball small">{draw.thunderball}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReferenceDraws;
