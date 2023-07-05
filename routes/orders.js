const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/products');

router.get('/', (req, res) => {
    Order.find()
        .select('_id productId quantity')
        .then(result => {
            return res.status(201).json({
                count: result.length,
                orders: result.map(doc => {
                    return {
                        _id: doc._id,
                        productId: doc.productId,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http:localhost:3000/orders' + doc._id
                        }

                    }
                }),
                request: "sd"
            });
        })
        .catch(e => {
            console.log(e);
            return res.status(500).json({ error: e });
        });
});

router.post('/', (req, res) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) return res.status(404).json({ message: 'Product not found' });
            const order = new Order({
                productId: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(result => {
            return res.status(201).json({
                message: "Order created",
                createadOrder: result,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(e => {
            console.log(e);
            return res.status(500).json({ error: e });
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Order.findById(id)
        .then(result => {
            if (result === null) return res.status(404).json({ message: 'Order not found' });
            else {
                return res.status(200).json({
                    order: result,
                    request: 'GET',
                    url: 'http://localhost:3000/orders'
                });
            }
        })
        .catch(e => {
            console.log(e);
            return res.status(500).json({ error: e });
        });


});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Order.findByIdAndDelete(id)
        .then(() => {
            return res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders',
                    bodyData: { productId: 'ObjectId', quantity: 'Number' }
                }
            });
        })
        .catch(e => {
            console.log(e);
            return res.status(500).json({ error: e });
        });
});

module.exports.orders = router;