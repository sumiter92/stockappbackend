// const mongoose = require("mongoose");

// const Stocks = mongoose.model(
//   "stocks",
//   new mongoose.Schema({
//     sharename: String,
//     sharevalue: String,
//     user: { type: Schema.Types.ObjectId, ref: 'users' },
//     stockOrders: [{ type: Schema.Types.ObjectId, ref: 'stockorders' }]
//   })
// );

// module.exports = Stocks;



const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Stocks = new Schema({
  companyname:{
    type: String,
    required:true
  },
  sharename: {
    type: String,
    required: true
  },
  sharevalue:{
    type:String,
    required:true
  },
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  stockcounts: [{ type: Schema.Types.ObjectId, ref: 'stockcounts' }]
});

module.exports = mongoose.model('stocks', Stocks );