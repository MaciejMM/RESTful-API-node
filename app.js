const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const process = require('./nodemon.json')

const mongoUrl = `mongodb+srv://node-rest-shop:${process.env.MONGO_ATLAS_PW}@node-rest-shop.erlnq.mongodb.net/node-rest-shop?retryWrites=true&w=majority`;

const productRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/order')

mongoose.connect(mongoUrl,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allowed-Methods', 'PUT, POST, PATCH, DELETE, GET')
    }

})
// Routes for handling request
app.use('/products', productRoutes)
app.use('/orders', ordersRoutes)


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;