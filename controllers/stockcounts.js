

const StockCounts= require('../models/stockCounts.js');
const Stocks= require('../models/stockModel.js');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');


exports.addStockCount= function(req,res){
    const user = res.locals.user;
    const {sharescount}=req.body;
    const stockCount = new StockCounts({
        sharescount
    })
    Stocks.findById(req.body.stockId,function(err,Stock){
       if(err){
        return res.status(422).send({errors: [{title: err, detail: 'ERROR'}]});
       }
       stockCount.stock = Stock;
       stockCount.user = user;
       stockCount.save();
       res.send(stockCount);
   })
}


exports.getUserStocks= function(req,res){
    const user = res.locals.user;  
    StockCounts
    .where({user})
    .populate('stock')
    .exec(function(err, foundUserStocks) {
        res.send(foundUserStocks);
   })
}
