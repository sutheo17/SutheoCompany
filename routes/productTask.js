const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/common/checkAuth");

module.exports = function (app) {
    const objectRepository = {};

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

    app.get('/product/modify',
        checkAuthMW(true),
        renderMW(objectRepository, 'productmodify')
    );
};