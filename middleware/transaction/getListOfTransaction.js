/*
    Get the list of transactions (res.locals.transactions)
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {

    const TransactionModel = requireOption(objectRepository, 'TransactionModel');

    return function (req, res, next) {
        if(typeof res.locals.product === 'undefined'){
            return next();
        }
        TransactionModel.find({_product: res.locals.product._id})
            .populate('_product')
            .populate('_user')
            .then((transactions) => {
                res.locals.transactions = transactions;
                return next();
        }).catch((err) => {return next(err)});
    };

};