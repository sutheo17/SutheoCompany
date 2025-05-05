/*
    Get a single customer (res.locals.customer)
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {

    const CustomerModel = requireOption(objectRepository, 'CustomerModel');

    return function (req, res, next) {
        CustomerModel.findOne({_id:req.params.customerid})
            .then((customer) =>
            {
                res.locals.customer = customer;
                return next();
            }).catch((err) => {return next(err)});
    };

};