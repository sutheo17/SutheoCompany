/*
    Delete a customer from the database
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const CustomerModel = requireOption(objectRepository, 'CustomerModel');

    return function (req, res, next) {
        if (typeof req.params.customerid === 'undefined') {
            return next('Customer ID is missing');
        }

        CustomerModel.deleteOne({ _id: req.params.customerid })
            .then(() => {
                return res.redirect('/customer');
            })
            .catch((err) => {
                return next(err);
            });
    };
};