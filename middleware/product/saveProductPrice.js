/*
    Used for updating the product price (so not every field has to be updated
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const ProductModel = requireOption(objectRepository, 'ProductModel');

    return function (req, res, next) {
        const product = res.locals.product;


        if (!product) {
            return next(new Error('Product not found in res.locals'));
        }

        if (typeof req.body.price === 'undefined') {
            return next(new Error('Missing price in form data'));
        }

        //update the price
        product.price = parseInt(req.body.price, 10);

        product.save()
            .then(() => res.redirect('/pricing'))
            .catch((err) => next(err));
    };
};