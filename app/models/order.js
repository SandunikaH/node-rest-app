const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    // array of objects
    productList: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            unitPrice: {type: Number},
            productQty: { type: Number }
        }
    ]
});

module.exports = mongoose.model('Order', orderSchema);