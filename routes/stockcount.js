const express = require('express');
const StockCount = require('../controllers/stockcounts');
const UserCtrl = require('../controllers/user');
const router = express.Router();

router.post('/addStockCount', UserCtrl.authMiddleware, StockCount.addStockCount);

router.get('/getUserStocks', UserCtrl.authMiddleware, StockCount.getUserStocks);

module.exports = router;