const renderMW =  require('../middleware/common/render.js')
const loginMW = require('../middleware/auth/login');
const logoutMW = require('../middleware/auth/logout');
const checkAuthMW = require('../middleware/auth/checkAuth');
const getListOfProductMW = require('../middleware/product/getListOfProduct');
const getListOfProjectPopulatedMW = require('../middleware/project/getListOfProjectsPopulated');
const getProjectsByCountyMW = require('../middleware/trends/getProjectsByCounty');
const getListOfQuotesMW = require('../middleware/project/getListOfQuotes');
const getListOfTransactionMW = require('../middleware/transaction/getListOfTransaction');


const UserModel = require('../models/user');
const ProjectModel = require('../models/project');
const ProductModel = require('../models/product');
const QuoteModel = require('../models/quote');
const TransactionModel = require('../models/transaction');

module.exports = function (app) {
    const objectRepository = {
        UserModel: UserModel,
        ProductModel: ProductModel,
        ProjectModel: ProjectModel,
        QuoteModel: QuoteModel,
        TransactionModel: TransactionModel
    };

    // Login page render
    app.get('/login',
        renderMW(objectRepository, 'login')
    );

    // Process login attempt
    app.post('/login',
        loginMW(objectRepository),
        (req, res) => res.redirect('/')
    );

    // Process logout attempt
    app.post('/logout',
        logoutMW(objectRepository)
    );

    // Trends
    app.get('/trends',
        checkAuthMW(false),
        getListOfProjectPopulatedMW(objectRepository, false),
        getListOfProductMW(objectRepository),
        getListOfQuotesMW(objectRepository),
        getProjectsByCountyMW(objectRepository),
        getListOfTransactionMW(objectRepository),
        renderMW(objectRepository, 'trends')
    );

    // Index
    app.get('/',
        checkAuthMW(false),
        getListOfProductMW(objectRepository),
        renderMW(objectRepository, 'index')
    );
};