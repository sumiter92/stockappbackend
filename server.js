
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var bodyParser = require('body-parser');
const config = require('./config');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const User= require('./models/user.js');
const Stocks= require('./models/stockModel.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserCtrl = require('./controllers/user');
app.use(bodyParser.json());
app.use(cors());

const userRoutes = require('./routes/users'),
       stockCount = require('./routes/stockCount'),
       stocks = require('./routes/stocks');
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/stockcounts', stockCount);
app.use('', stocks);


//DataBase//
mongoose.connect(config.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
    console.log("database connected");
}).catch(err=>{
    console.log(err);
});
 
app.post('/addStock',function(req,res){

    const { companyname ,sharename, sharevalue } = req.body;

  if (!companyname || !sharename || !sharevalue) {
    return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide companyname, sharename and sharevalue'}]});
  }
    
   const Stock = new Stocks({
    companyname:companyname,
    sharename: sharename,
    sharevalue: sharevalue
   });
   Stock.save((err,Stock)=>{
       if(err){
           console.log("error in stock saving")
       }
       res.send({Stock});
   })
})

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });


//Socket.io Implementation

io.on('connection', (socket) => { 
    socket.emit('hello', socket.id);
    console.log(socket.id);
    /* … */ });
server.listen(PORT);



//cron jobs//
setInterval(function updateStocks(){
    Stocks.find({},function(err,Stock){
      if(err){
          res.send({message:"stock not found."})
      }
      var offset = 0; 
      Stock.map((Stock,id)=>{
          setTimeout(function(){
            console.log(Stock);
            console.log(id);
            var oldsharevalue = (Math.random() * 5)+0.2 * parseInt(Stock.sharevalue);
            if (oldsharevalue < 0) {
                oldsharevalue = oldsharevalue * -1;
            }
            var newShareValue={
                sharevalue: oldsharevalue.toFixed(2)
            
            }
            Stocks.update({_id: Stock.id},newShareValue, function(err,newstock){
                if(err){
                    console.log(err)
                }
                console.log(newstock,"newstock");
                io.emit('broadcast', Stock ); 
            });

          },3000 + offset);
          offset += 3000;
      })
    })
},32000)
