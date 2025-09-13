const express = require('express');
const app = express();
const bcrypt = require('express')
require('dotenv').config();
// creating the socket server
const http = require('http');
const server = http.createServer(app);
const { initSocket } = require('./socket'); 
const conn = require('./Configs/Connection');
const courseRouter = require('./Routes/courseRouter');
const userRouter = require('./Routes/userRouter');
const orderRouter = require('./Routes/orderRoutes');
const userMarketRouter = require('./Routes/userMarketRoutes');
const productRouter = require('./Routes/productRoutes');
const organisationRouter = require('./Routes/OrganisationRouter');
const translationRouter = require('./Routes/translationRouter');

conn.conn();


initSocket(server);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/' , (req, res)=>{
    res.send('Backend Working');
});


app.use('/course', courseRouter);
app.use('/user', userRouter);
app.use('/orders', orderRouter);
app.use('/userMarket', userMarketRouter);
app.use('/product', productRouter);
app.use('/organisation', organisationRouter );
app.use('/translate', translationRouter );


const port= process.env.PORT || 3000;

server.listen(port ,"0.0.0.0" ,()=>{
    console.log('service is live on port 3000');
});
