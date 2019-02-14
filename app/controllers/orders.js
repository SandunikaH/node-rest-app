const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.getAllOrders = (req, res, next) => {
    Order
    .find()
    .select('product quantity _id')
    // property that points to another model
    .populate('product', 'name') 
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    orderId: doc._id,
                    productId: doc.product,
                    productQty: doc.quantity,
                    moreDetails: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
            
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.createOrder = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(item => {
        if(!item){
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });        
        return order.save();
    })
    .then(result => {
        console.log(result);
        res.status(200).json({            
            message: 'Order created successfully',
            newOrderDetails: {
                newOrderId: result._id,
                productInTheOrder: result.product,
                productQuantity: result.quantity 
            },
            moreDetails: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }
        });
        
    })
    .catch(error => {
            res.status(200).json({
                message: "down here",
                error: error
            });
    });
}

exports.getOrder = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        res.status(200).json({
            //orderId: req.params.orderId,
            orderDetails: order
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        });
    });
}

exports.deleteOrder = (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result => {
        if(!result){
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        res.status(200).json({
            message: 'Order deleted',
            viewOrders: {
                type: 'GET',
                url: 'http://localhost:3000/orders',
                bodyType: {
                    productId: 'ID',
                    quantity: 'Number'
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}