const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {

    const QuoteModel = requireOption(objectRepository, 'QuoteModel');

    return function (req, res, next) {
        QuoteModel.find({}).then((quotes) => {
            res.locals.quotes = quotes;
            return next();
        }).catch((err) => {return next(err)
        });
    };

};