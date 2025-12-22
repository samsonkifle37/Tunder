const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/refresh', apiController.refreshData);
router.get('/stats', apiController.getStats);
router.post('/generate', apiController.generateTickets);

module.exports = router;
