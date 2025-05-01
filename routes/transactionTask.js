const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/common/checkAuth");

module.exports = function (app) {
    const objectRepository = {};

    app.get('/transaction/product',
        checkAuthMW(false),
        renderMW(objectRepository, 'transaction')
    );

    app.get('/transaction/product/add',
        checkAuthMW(true),
        renderMW(objectRepository, 'transactionmodify')
    );

    app.get('/transaction/product/modify',
        checkAuthMW(true),
        renderMW(objectRepository, 'transactionmodify')
    );
};