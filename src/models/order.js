const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1},
    status: { type: String, default: 'Payment accepted'}
});

module.exports = mongoose.model('Order', orderSchema);