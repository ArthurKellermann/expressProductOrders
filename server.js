const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const mongoose = require('mongoose');

require('dotenv').config();

const products_routes = require('./routes/products').products;
const orders_routes = require('./routes/orders').orders;

//Database Connection
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.emit('DB Connected');
    }).catch(e => console.log('Error: ' + e));

//JSON config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

//Prevent Cors Errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(202).json({});
    }
    next();
});

//Routes
app.use('/products', products_routes);
app.use('/orders', orders_routes);


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    return res.status(error.status || 500).json({ error: { message: error.message } });
});


app.on('DB Connected', () => {
    app.listen(port, () => {
        console.log('Server is running');
    });
});