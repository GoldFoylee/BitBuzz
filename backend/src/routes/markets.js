const express = require('express');
const router = express.Router();
const { listMarkets, getMarket, createMarket, settleMarket } = require('../controllers/marketController');
const { authMiddleware, adminMiddleware } = require('../middleware/index');

router.get('/', listMarkets);
router.get('/:id', getMarket);
router.post('/', authMiddleware, adminMiddleware, createMarket);
router.post('/:id/settle', authMiddleware, adminMiddleware, settleMarket);

module.exports = router;
