const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {

    const ProductModel = requireOption(objectRepository, 'ProductModel');

    return function (req, res, next) {
        ProductModel.find({}).then((products) => {
            res.locals.products = products;
            return next();
        }).catch((err) => {return next(err)
        });
    };

};