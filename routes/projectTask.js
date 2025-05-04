const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/auth/checkAuth");
const getListOfProductMW = require('../middleware/product/getListOfProduct');
const getListOfQuotesMW = require('../middleware/project/getListOfQuotes');
const getListOfProjectsMW = require('../middleware/project/getListOfProjects');
const getListOfUserMW = require('../middleware/common/getListOfUser');
const getQouteMW = require('../middleware/project/getQuote');
const getProjectMW = require('../middleware/project/getProject');
const saveQuoteMW = require('../middleware/project/saveQuote');
const getListOfCustomerMW = require('../middleware/customer/getListOfCustomer');
const saveProjectMW = require('../middleware/project/saveProject');
const ProductModel = require('../models/product');
const QuoteModel = require('../models/quote');
const UserModel = require('../models/user');
const CustomerModel = require('../models/customer');
const ProjectModel = require('../models/project');

module.exports = function (app) {
    const objectRepository = {
        ProductModel: ProductModel,
        QuoteModel: QuoteModel,
        UserModel: UserModel,
        CustomerModel: CustomerModel,
        ProjectModel: ProjectModel
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
        getListOfProjectsMW(objectRepository, true),
        renderMW(objectRepository, 'project')
    );

    app.get('/project/add',
        checkAuthMW(true),
        getListOfQuotesMW(objectRepository),
        getListOfCustomerMW(objectRepository),
        getListOfUserMW(objectRepository),
        (req, res, next) => {
            res.locals.project = undefined;
            return next();
        },
        renderMW(objectRepository, 'projectmodify')
    );

    app.get('/project/modify/:projectid',
        checkAuthMW(true),
        getListOfQuotesMW(objectRepository),
        getListOfCustomerMW(objectRepository),
        getListOfUserMW(objectRepository),
        getProjectMW(objectRepository),
        renderMW(objectRepository, 'projectmodify')
    );

    app.post('/project/save/:projectid?',
        checkAuthMW(true),
        saveProjectMW(objectRepository),
        renderMW(objectRepository, 'projectmodify')
    );
};