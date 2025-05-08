/*
    Delete a quote from the database
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const QuoteModel = requireOption(objectRepository, 'QuoteModel');

    return function (req, res, next) {
        if (typeof req.params.quoteid === 'undefined') {
            return next('Quote ID is missing');
        }

        QuoteModel.deleteOne({ _id: req.params.quoteid })
            .then(() => {
                return res.redirect('/quote');
            })
            .catch((err) => {
                return next(err);
            });
    };
};