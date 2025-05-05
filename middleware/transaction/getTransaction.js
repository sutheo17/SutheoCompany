/*
    Get a single transaction (res.locals.transaction)
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {

    const TransactionModel = requireOption(objectRepository, 'TransactionModel');

    return function (req, res, next) {
        TransactionModel.findOne({_id:req.params.transactionid})
            .populate('_product')
            .then((transaction) =>
        {
            res.locals.transaction = transaction;
            return next();
        }).catch((err) => {return next(err)});
    };

};