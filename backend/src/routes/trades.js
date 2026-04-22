const express = require('express');
const router = express.Router();
const { executeTrade, getPortfolio } = require('../controllers/tradeController');
const { authMiddleware } = require('../middleware/index');

router.post('/', authMiddleware, executeTrade);
router.get('/portfolio', authMiddleware, getPortfolio);

module.exports = router;
