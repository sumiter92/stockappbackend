const express = require('express');
const Stocks = require('../controllers/stocks');
const UserCtrl = require('../controllers/user');
const router = express.Router();


router.get('/', Stocks.getStocksList);


module.exports = router;