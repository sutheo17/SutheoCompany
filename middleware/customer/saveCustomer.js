const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const CustomerModel = requireOption(objectRepository, 'CustomerModel');

    return function (req, res, next) {
        if (
            typeof req.body.name === 'undefined' ||
            typeof req.body.email === 'undefined' ||
            typeof req.body.county === 'undefined' ||
            typeof req.body.city === 'undefined' ||
            typeof req.body.zip === 'undefined' ||
            typeof req.body.address === 'undefined' ||
            typeof req.body.phone === 'undefined'
        ) {
            return next(new Error('Missing customer data'));
        }

        const customer = res.locals.customer || new CustomerModel();

        customer.name = req.body.name;
        customer.email = req.body.email;
        customer.county = req.body.county;
        customer.city = req.body.city;
        customer.zip = parseInt(req.body.zip, 10);
        customer.address = req.body.address;
        customer.phone = req.body.phone;

        customer.save()
            .then(() => res.redirect('/customer'))
            .catch(err => next(err));
    };
};