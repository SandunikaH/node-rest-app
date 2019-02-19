const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://admin-user:' + process.env.MONGO_ATLAS_PW + '@node-rest-app-shard-00-00-lvjhz.mongodb.net:27017,node-rest-app-shard-00-01-lvjhz.mongodb.net:27017,node-rest-app-shard-00-02-lvjhz.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-app-shard-0&authSource=admin&retryWrites=true', { useNewUrlParser: true })
mongoose.Promise = global.Promise;

// logging
app.use(morgan('dev'));

//make productImages folder public
app.use('/productImages', express.static('productImages'));

// allow simple bodies of url encoded data
app.use(bodyParser.urlencoded({extended: false}))

// extract data and make them easily readable
app.use(bodyParser.json());

// adjust the response
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header(
    //     "Aceess-Control-Allow-Headers",
    //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    //     );
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    // res.header('Access-Control-Allow-Headers', 'Content-Type');
    // res.header('Access-Control-Allow-Headers', 'Authorization');
    if(req.method === 'OPTIONS'){
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
    }
    next();
});

const productRoutes = require('./app/routes/products');
const orderRoutes = require('./app/routes/orders');
const userRoutes = require('./app/routes/users');


// any url started with /products will be directed to productRoutes located at ./app/routes/products
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// handle every request that reach this line that couldn't get handled by productRoutes or orderRoutes 
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;