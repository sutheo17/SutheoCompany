const requireOption = require('../common/requireOption');
const path = require('path');
const fs = require('fs');

module.exports = function (objectRepository) {
    const ProductModel = requireOption(objectRepository, 'ProductModel');

    return function (req, res, next) {
        const product = res.locals.product;

        console.log('req.body:', req.body);
        console.log('res.locals.product:', res.locals.product);

        if (!product) {
            return next(new Error('Product not found in res.locals'));
        }

        if (typeof req.body.price === 'undefined') {
            return next(new Error('Missing price in form data'));
        }

        product.price = parseInt(req.body.price, 10);

        product.save()
            .then(() => res.redirect('/pricing'))
            .catch((err) => next(err));
    };
};