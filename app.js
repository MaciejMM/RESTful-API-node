const express = require('express');
const app = express();
const morgan = require('morgan');


const productRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/order')

app.use(morgan('dev'));


// Routes for handling request
app.use('/products', productRoutes)
app.use('/orders', ordersRoutes)


app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status(404);
    next(error);
})

app.use((error, req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        error:{
            message:error.message
        }
    });
})

module.exports = app;