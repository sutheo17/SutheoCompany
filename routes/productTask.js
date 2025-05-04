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

const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

    app.get('/pricing',
        checkAuthMW(true),
        getListOfProductMW(objectRepository),
        renderMW(objectRepository, 'pricing')
    );

    app.get('/pricing/modify/:productid',
        checkAuthMW(true),
        getProductMW(objectRepository),
        renderMW(objectRepository, 'pricingmodify')
    );

    app.post('/pricing/save/:productid',
        checkAuthMW(true),
        getProductMW(objectRepository),
        saveProductPriceMW(objectRepository)
    );

    app.post('/product/save/:productid?',
        checkAuthMW(true),
        getProductMW(objectRepository),
        upload.single('photo'),
        saveProductMW(objectRepository)
    );

    app.get('/product/add',
        checkAuthMW(true),
        (req, res, next) => {
            res.locals.product = undefined;
            return next();
        },
        renderMW(objectRepository, 'productmodify')
    );

    app.get('/product/modify/:productid',
        checkAuthMW(true),
        getProductMW(objectRepository),
        renderMW(objectRepository, 'productmodify')
    );

    app.post('/product/delete/:productid',
        checkAuthMW(true),
        deleteProductMW(objectRepository)
    );

    app.get('/product/:productid',
        checkAuthMW(false),
        getProductMW(objectRepository),
        renderMW(objectRepository, 'product')
    );
};