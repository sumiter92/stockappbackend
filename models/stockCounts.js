const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockCounts = new Schema({
  sharescount: {
    type: String,
    min: [1, 'value can not be blank'],
    max: [4, 'This time you are allowed to purchase lesser amount.'],
    required: true
  },
  stock:{type: Schema.Types.ObjectId, ref: 'stocks'},
  user: {type: Schema.Types.ObjectId, ref: 'users'}

});

module.exports = mongoose.model('stockcounts', stockCounts );