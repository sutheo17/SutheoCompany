const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/auth/checkAuth");
const saveProductMW = require('../middleware/product/saveProduct');

const ProductModel = require('../models/product');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
        renderMW(objectRepository, 'pricing')
    );

    app.get('/pricing/modify',
        checkAuthMW(true),
        renderMW(objectRepository, 'pricingmodify')
    );

    app.get('/product',
        checkAuthMW(false),
        renderMW(objectRepository, 'product')
    );

    app.get('/product/add',
        checkAuthMW(true),
        renderMW(objectRepository, 'productmodify')
    );

    app.post('/product/add',
        checkAuthMW(true),
        upload.single('photo'),
        upload.single('photo'),
        (req, res, next) => {
            console.log('DEBUG FILE:', req.file); // <-- ide
            console.log('DEBUG BODY:', req.body); // <-- ide
        }
        //saveProductMW(objectRepository) // itt végződjön a lánc!
    );

    app.get('/product/modify',
        checkAuthMW(true),
        renderMW(objectRepository, 'productmodify')
    );
};