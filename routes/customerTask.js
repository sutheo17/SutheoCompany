const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/auth/checkAuth");
const getListOfCustomerMW =  require('../middleware/customer/getListOfCustomer');
const getCustomerMW =  require('../middleware/customer/getCustomer');
const saveCustomerMW =  require('../middleware/customer/saveCustomer');
const CustomerModel = require('../models/customer');
const ProjectModel = require('../models/project');
const deleteCustomerMW = require("../middleware/customer/deleteCustomer");
const isCustomerUsedMW = require("../middleware/customer/isCustomerUsed");
const getListOfProjectsPopulated = require("../middleware/project/getListOfProjectsPopulated");

module.exports = function (app) {
    const objectRepository = {
        CustomerModel: CustomerModel,
        ProjectModel: ProjectModel,
    };

    // Customer
    app.get('/customer',
        checkAuthMW(true),
        getListOfCustomerMW(objectRepository),
        renderMW(objectRepository, 'customer')
    );

    // Add a new customer
    app.get('/customer/add',
        checkAuthMW(true),
        (req, res, next) => {
            res.locals.customer = undefined;
            return next();
        },
        renderMW(objectRepository, 'customermodify')
    );

    // Delete a customer
    app.post('/customer/delete/:customerid',
        checkAuthMW(true),
        getListOfProjectsPopulated(objectRepository),
        isCustomerUsedMW(objectRepository),
        deleteCustomerMW(objectRepository)
    );

    // Modify an existing customer
    app.get('/customer/modify/:customerid',
        checkAuthMW(true),
        getCustomerMW(objectRepository),
        (req, res, next) => {
            res.locals.used = req.query.used === '1';
            res.locals.projectNames = req.query.projects ? decodeURIComponent(req.query.projects) : null;
            return next();
        },
        renderMW(objectRepository, 'customermodify')
    );

    // Save a new customer or update an existing one
    app.post('/customer/save/:customerid?',
        checkAuthMW(true),
        getCustomerMW(objectRepository),
        saveCustomerMW(objectRepository)
    );
};