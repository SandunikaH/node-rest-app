const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../auth/check-auth');

const productController = require('../controllers/products');

// how files get stored
const storeFile = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './productImages');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const filterFileType = function(req, file, cb){
    if(file.mimetype === 'image/jpeg' || 'image/png' || 'image/jpg'){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storeFile, 
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: filterFileType
});

// any url starting with /product will be handled by this file. Hence no need to specidy /product here again. Instead, use url after /product
router.get('/', productController.getAllProducts);

// handling post requests
router.post('/', checkAuth, upload.single('productImage'), productController.createProduct);

router.get('/:productId', productController.getProduct);

router.patch('/:productId', checkAuth, productController.updateProduct);

router.delete('/:productId', checkAuth, productController.deleteProduct);

module.exports = router;