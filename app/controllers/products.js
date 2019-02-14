const mongoose = require('mongoose');

const Product = require('../models/product');

exports.getAllProducts = (req, res, next) => {
    Product
    .find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const adjustedResponse = {
            count: docs.length,
            //products: docs
            products: docs.map(doc => {
                return {
                    productName: doc.name,
                    productPrice: doc.price,
                    productImage: doc.productImage,
                    productID: doc._id,
                    moreDetails: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(adjustedResponse);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.createProduct = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });   
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Product created successfully',
            //createdProduct: result
            createdProduct: {
                productName: result.name,
                productPrice: result.price,
                productID: result._id,
                moreDetails: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                basicDetails: doc,
                moreDetails: {
                    type: 'GET',
                    description: 'Product details',
                    url: 'http://localhost:3000/products'
                }
            });
        } else{
            res.status(404).json({message: "Product not found"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.updateProduct = (req, res, next) => {
    const updateOptions = {};
    for (const options of req.body){
        updateOptions[options.propName] = options.value;
    }
    Product.update({_id: req.params.productId}, {$set: updateOptions})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated!',
            moreDetails: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + req.params.productId
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err  
        });
    });
}

exports.deleteProduct = (req, res, next) => {
    Product
    .remove({_id: req.params.productId})
    .exec()
    .then(result => {
        if(!result){
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        res.status(200).json({
            message: 'Product deleted',
            allProducts: {
                type: 'GET',
                url: 'http://localhost:3000/products'
            },
            addNewProduct: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                bodyType: {
                    name: 'String',
                    price: 'Number'
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}