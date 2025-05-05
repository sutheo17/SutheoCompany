/*
    Get the list of customers (res.locals.customers)
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {

    const CustomerModel = requireOption(objectRepository, 'CustomerModel');

    return function (req, res, next) {
        CustomerModel.find({}).then((customers) => {
            res.locals.customers = customers;
            return next();
        }).catch((err) => {return next(err)
        });
    };

};