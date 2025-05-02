const renderMW =  require('../middleware/common/render.js')
const loginMW = require('../middleware/auth/login');
const logoutMW = require('../middleware/auth/logout');
const checkAuthMW = require('../middleware/auth/checkAuth');
const getListOfProductMW = require('../middleware/product/getListOfProduct');

const UserModel = require('../models/user');
const ProductModel = require('../models/product');

module.exports = function (app) {
    const objectRepository = {
        UserModel: UserModel,
        ProductModel: ProductModel
    };

    // Login oldal megjelenítése
    app.get('/login',
        renderMW(objectRepository, 'login')
    );

    // Login POST feldolgozása
    app.post('/login',
        loginMW(objectRepository),
        (req, res) => res.redirect('/')
    );

    app.post('/logout',
        logoutMW(objectRepository)
    );

    app.get('/trends',
        checkAuthMW(false),
        renderMW(objectRepository, 'trends')
    );

    app.get('/',
        checkAuthMW(false),
        getListOfProductMW(objectRepository),
        renderMW(objectRepository, 'index')
    );
};