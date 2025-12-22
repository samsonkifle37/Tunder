import React from 'react';

const TicketGenerator = ({ onGenerate, tickets }) => {
    return (
        <div className="ticket-generator">
            <h2>🎟️ Smart Generator</h2>
            <button onClick={onGenerate} className="btn-generate">
                Generate Recommended Tickets
            </button>

            <div className="tickets-display">
                {tickets.map((ticket, index) => (
                    <div key={index} className="ticket-card fade-in">
                        <div className="ticket-header">
                            <span className="ticket-type">{ticket.type}</span>
                        </div>
                        <div className="ticket-numbers">
                            {ticket.main.map(n => (
                                <span key={n} className="ball main-ball">{n}</span>
                            ))}
                            <span className="ball thunder-ball">{ticket.thunderball}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketGenerator;
