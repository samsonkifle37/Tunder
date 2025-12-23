import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatsPanel from './StatsPanel';
import FrequencyChart from './FrequencyChart';
import TicketGenerator from './TicketGenerator';
import ReferenceDraws from './ReferenceDraws';
import './Dashboard.css';

const API_BASE = '/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_BASE}/stats`);
            setStats(res.data);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (err) {
            console.error(err);
            setStats({ error: err.message || 'Failed to load data' });
        }
    };

    const handleRefresh = async () => {
        await axios.get(`${API_BASE}/refresh`);
        fetchStats();
    };

    const handleGenerate = async () => {
        try {
            const res = await axios.post(`${API_BASE}/generate`);
            setTickets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (!stats) return <div>Loading Statistics...</div>;
    if (stats.error) return <div className="error-message">⚠️ {stats.error}</div>;

    return (
        <div className="dashboard">
            <div className="controls">
                <button onClick={handleRefresh} className="btn-refresh">
                    🔄 Refresh Results
                </button>
                {lastUpdated && <span className="last-update">Last updated: {lastUpdated}</span>}
            </div>

            <div className="grid-container">
                <section className="panel stats-section">
                    <StatsPanel stats={stats} />
                    <ReferenceDraws draws={stats.recentDraws} />
                </section>

                <section className="panel chart-section">
                    <FrequencyChart data={stats.mainstats.frequency} title="Main Number Frequency" color="#8884d8" minY={300} />
                    <FrequencyChart data={stats.thunderballStats.frequency} title="Thunderball Frequency" color="#ff7300" />
                </section>

                <section className="panel generator-section">
                    <TicketGenerator onGenerate={handleGenerate} tickets={tickets} />
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
