const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.getAllOrders = (req, res, next) => {
    Order
    .find()
    .select('_id productList')
    .populate('product') 
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    orderId: doc._id,
                    itemList: doc.productList
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
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        productList: req.body
    });  
    order
    .save()
    .then(result => {
        res.status(200).json({            
            message: 'Order created successfully',
            newOrderDetails: {
                newOrderId: result._id,
                orderedItems: result.productList
            }
        });
    })
    .catch(error => {
            res.status(200).json({
                error: error
            });
    });
}

exports.updateOrder = (req, res, next) => {
    console.log("order updated...");
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
            orderId: order._id,
            orderDetails: order.productList
        });
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
            message: 'Order deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}