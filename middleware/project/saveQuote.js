/*
    Save a new quote or update an existing one.
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const QuoteModel = requireOption(objectRepository, 'QuoteModel');

    return async function (req, res, next) {
        let items = [];

        //try parsing the json
        try {
            items = JSON.parse(req.body.items);
        } catch (e) {
            res.locals.error = `JSON parsing error: ${e.message}`;
            return next();
        }

        if (!Array.isArray(items)) {
            res.locals.error = `Invalid format.`;
            return next();
        }

        const projectName = req.body.project_name?.trim();
        if (!projectName) {
            res.locals.error = `Missing project name: ${projectName}.`;
            return next();
        }

        const quoteId = req.params.quoteid;

        let quote;

        //check if a quote was given
        if (quoteId) {
            quote = await QuoteModel.findById(quoteId);
            if (!quote) {
                res.locals.error = 'Qoute not found';
                return next();
            }

            quote.project_name = projectName;
            quote.items = items;
            console.log(`Updating quote ${quoteId}`);
        } else {
            //create a new quote
            quote = new QuoteModel({
                project_name: projectName,
                items
            });
            console.log('Creating new quote');
        }

        quote.profit = parseFloat(req.body.profit) || 0;
        quote.calculated_price = parseFloat(req.body.calculated_price) || 0;
        quote.final_price = parseFloat(req.body.final_price) || 0;

        quote.save()
            .then(() => {
                console.log(`Project saved (${quote._id})`);
                res.redirect(`/`);
            })
            .catch((err) => next(err));
    };
};