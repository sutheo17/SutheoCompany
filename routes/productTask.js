const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/auth/checkAuth");
const saveProductMW = require('../middleware/product/saveProduct');
const saveProductPriceMW = require('../middleware/product/saveProductPrice');
const getProductMW = require('../middleware/product/getProduct');
const deleteProductMW = require('../middleware/product/deleteProduct');

const ProductModel = require('../models/product');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const getListOfProductMW = require("../middleware/product/getListOfProduct");

//save the product image to a designated folder
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const targetDir = 'C:/SutheoCompany/images';
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            cb(null, targetDir);
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const filename = `${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
            cb(null, filename);
        }
    })
});

module.exports = function (app) {
    const objectRepository = {
        ProductModel: ProductModel
    };

    // Pricing
    app.get('/pricing',
        checkAuthMW(true),
        getListOfProductMW(objectRepository),
        renderMW(objectRepository, 'pricing')
    );

    // Modfiy an existing pricing
    app.get('/pricing/modify/:productid',
        checkAuthMW(true),
        getProductMW(objectRepository),
        renderMW(objectRepository, 'pricingmodify')
    );

    // Update an existing pricing
    app.post('/pricing/save/:productid',
        checkAuthMW(true),
        getProductMW(objectRepository),
        saveProductPriceMW(objectRepository)
    );

    // Save a new product or update an existing one
    app.post('/product/save/:productid?',
        checkAuthMW(true),
        getProductMW(objectRepository),
        //save the image for the product
        upload.single('photo'),
        saveProductMW(objectRepository)
    );

    // Add a new product
    app.get('/product/add',
        checkAuthMW(true),
        (req, res, next) => {
            res.locals.product = undefined;
            return next();
        },
        renderMW(objectRepository, 'productmodify')
    );

    // Modify an existing product
    app.get('/product/modify/:productid',
        checkAuthMW(true),
        getProductMW(objectRepository),
        renderMW(objectRepository, 'productmodify')
    );

    // Delete a product
    app.post('/product/delete/:productid',
        checkAuthMW(true),
        deleteProductMW(objectRepository)
    );

    // Product details
    app.get('/product/:productid',
        checkAuthMW(false),
        getProductMW(objectRepository),
        renderMW(objectRepository, 'product')
    );
};