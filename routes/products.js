const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products');


router.get('/', (req, res) => {
    Product.find()
        .select('name price _id')
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            return res.status(200).json(response);
        })
        .catch(e => {
            console.log(e);
            return res.status(500).json({ error: e });
        });
});

router.post('/', (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    });

    product
        .save()
        .then(result => {
            console.log(result);
            return res.status(201).json({
                message: "Product Created!",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id,
                    }
                }
            });
        }).catch(e => {
            console.log(e)
            return res.status(500).json({ error: e });
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .select('name price _id')
        .then(doc => {
            console.log(doc);
            if (doc) {
                return res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                return res.status(404).json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(e => {
            console.log(e);
            return res.status(500).json({ error: e });
        });
});

router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
        // [ { "propName": "price", "value": 20.00 } ]  
    }
    Product.updateOne({ _id: id }, { $set: updateOps })
        .then(result => {
            return res.status(200).json({
                message: 'Product updated!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(e => {
            console.log(e);
            return res.status(500).json({ error: e });
        });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Product.findByIdAndDelete(id)
        .then(result => {
            return res.status(200).json({
                message: 'Product deleted!',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    bodyData: { name: 'String', price: 'Number'}
                }
            });
        })
        .catch(e => {
            console.log(e);
            return res.status(500).json({ error: e });
        });
});

module.exports.products = router;