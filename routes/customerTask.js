const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/auth/checkAuth");

module.exports = function (app) {
    const objectRepository = {};

    app.get('/customer',
        checkAuthMW(true),
        renderMW(objectRepository, 'customer')
    );

    app.get('/customer/add',
        checkAuthMW(true),
        renderMW(objectRepository, 'customermodify')
    );

    app.get('/customer/modify',
        checkAuthMW(true),
        renderMW(objectRepository, 'customermodify')
    );
};