

const Stocks= require('../models/stockModel.js');

exports.getStocksList= function (req, res) {
Stocks.find({},(err,Stock)=>{
    if(err){
        res.send({message:"Internal Server Error"});
    }
    res.send({Stock});
})
}