const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/auth/checkAuth");
const getListOfProductMW = require('../middleware/product/getListOfProduct');
const getListOfQuotesMW = require('../middleware/project/getListOfQuotes');
const getListOfProjectsMW = require('../middleware/project/getListOfProjects');
const getListOfUserMW = require('../middleware/common/getListOfUser');
const getQuoteMW = require('../middleware/project/getQuote');
const getProjectMW = require('../middleware/project/getProject');
const saveQuoteMW = require('../middleware/project/saveQuote');
const getListOfCustomerMW = require('../middleware/customer/getListOfCustomer');
const saveProjectMW = require('../middleware/project/saveProject');
const getSummaryMW = require('../middleware/project/getSummary');
const printSummaryMW = require('../middleware/project/printSummary');
const deleteProjectMW = require('../middleware/project/deleteProject');
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

    // Quote
    app.get('/quote',
        checkAuthMW(true),
        getListOfProductMW(objectRepository),
        getListOfQuotesMW(objectRepository),
        renderMW(objectRepository, 'quote')
    );

    // Save a new quote or update an existing one
    app.post('/quote/save/:quoteid?',
        checkAuthMW(true),
        saveQuoteMW(objectRepository)
    );

    // Load a quote from the database
    // A JSON gets returned from this route
    app.post('/quote/load/:quoteid',
        checkAuthMW(true),
        getQuoteMW(objectRepository),
        (req, res) => {
            if (!res.locals.quote)
            {
                return res.status(404).json({ error: 'Quote not found' });
            }
            return res.json(res.locals.quote); //return the Quote document
        }
    );

    // Project
    app.get('/project',
        checkAuthMW(),
        getListOfProjectsMW(objectRepository, true),
        renderMW(objectRepository, 'project')
    );

    // Add a new project
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

    // Modify an existing project
    app.get('/project/modify/:projectid',
        checkAuthMW(true),
        getListOfQuotesMW(objectRepository),
        getListOfCustomerMW(objectRepository),
        getListOfUserMW(objectRepository),
        getProjectMW(objectRepository),
        (req, res, next) => {
            res.locals.print = req.query.printed === '1';
            return next();
        },
        renderMW(objectRepository, 'projectmodify')
    );

    // Delete a project
    app.post('/project/delete/:projectid',
        checkAuthMW(true),
        deleteProjectMW(objectRepository)
    );

    // Save a new project or update an existing one
    app.post('/project/save/:projectid?',
        checkAuthMW(true),
        saveProjectMW(objectRepository),
        renderMW(objectRepository, 'projectmodify')
    );

    // Print a project
    app.post('/project/print/:projectid',
        checkAuthMW(true),
        getListOfProductMW(objectRepository),
        getProjectMW(objectRepository),
        getSummaryMW(objectRepository),
        printSummaryMW(objectRepository),
    );
};