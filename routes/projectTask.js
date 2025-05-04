const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/auth/checkAuth");
const getListOfProductMW = require('../middleware/product/getListOfProduct');
const getListOfQuotesMW = require('../middleware/project/getListOfQuotes');
const getListOfUserMW = require('../middleware/common/getListOfUser');
const getQouteMW = require('../middleware/project/getQuote');
const saveQuoteMW = require('../middleware/project/saveQuote');
const getListOfCustomerMW = require('../middleware/customer/getListOfCustomer');
const ProductModel = require('../models/product');
const QuoteModel = require('../models/quote');
const UserModel = require('../models/user');
const CustomerModel = require('../models/customer');

module.exports = function (app) {
    const objectRepository = {
        ProductModel: ProductModel,
        QuoteModel: QuoteModel,
        UserModel: UserModel,
        CustomerModel: CustomerModel
    };

    app.get('/quote',
        checkAuthMW(true),
        getListOfProductMW(objectRepository),
        getListOfQuotesMW(objectRepository),
        renderMW(objectRepository, 'quote')
    );

    app.post('/quote/save/:quoteid?',
        checkAuthMW(true),
        saveQuoteMW(objectRepository)
    );

    app.post('/quote/load/:quoteid',
        checkAuthMW(true),
        getQouteMW(objectRepository),
        (req, res) => {
            if (!res.locals.quote) return res.status(404).json({ error: 'Quote not found' });
            return res.json(res.locals.quote); //
        }
    );

    app.get('/project',
        checkAuthMW(),
        renderMW(objectRepository, 'project')
    );

    app.get('/project/add',
        checkAuthMW(true),
        getListOfQuotesMW(objectRepository),
        getListOfCustomerMW(objectRepository),
        getListOfUserMW(objectRepository),
        renderMW(objectRepository, 'projectmodify')
    );

    app.get('/project/modify',
        checkAuthMW(true),
        renderMW(objectRepository, 'projectmodify')
    );
};