const dataService = require('../services/dataService');
const statsService = require('../services/statsService');
const generatorService = require('../services/generatorService');

exports.refreshData = async (req, res) => {
    try {
        const result = await dataService.fetchAndParseData();
        res.json({ message: 'Data refreshed successfully', count: result.length });
    } catch (error) {
        console.error('Error refreshing data:', error);
        res.status(500).json({ error: 'Failed to refresh data' });
    }
};

exports.getStats = async (req, res) => {
    try {
        const stats = await statsService.calculateStats();
        res.json(stats);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
};

exports.generateTickets = async (req, res) => {
    try {
        const tickets = await generatorService.generateTickets();
        res.json(tickets);
    } catch (error) {
        console.error('Error generating tickets:', error);
        res.status(500).json({ error: 'Failed to generate tickets' });
    }
};
