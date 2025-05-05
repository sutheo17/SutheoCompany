/*
    Get a single quote (res.locals.quote)
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {

    const QuoteModel = requireOption(objectRepository, 'QuoteModel');

    return function (req, res, next) {
        QuoteModel.findOne({_id:req.params.quoteid})
            .then((quote) =>
            {
                console.log(quote);
                res.locals.quote = quote;
                return next();
            }).catch((err) => {return next(err)});
    };

};