const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const ProductModel = requireOption(objectRepository, 'ProductModel');

    return function (req, res, next) {
        if (typeof req.params.productid === 'undefined') {
            return next('Product ID is missing');
        }

        ProductModel.deleteOne({ _id: req.params.productid })
            .then(() => {
                return res.redirect('/');
            })
            .catch((err) => {
                return next(err);
            });
    };
};