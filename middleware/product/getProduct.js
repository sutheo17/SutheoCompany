const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {

    const ProductModel = requireOption(objectRepository, 'ProductModel');

    return function (req, res, next) {
        ProductModel.findOne({_id:req.params.productid}).then((product) =>
        {
            res.locals.product = product;
            return next();
        }).catch((err) => {return next(err)});
    };

};