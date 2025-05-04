const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const QuoteModel = requireOption(objectRepository, 'QuoteModel');

    return async function (req, res, next) {
        let items = [];

        try {
            items = JSON.parse(req.body.items);
        } catch (e) {
            console.error('❌ JSON parsing error:', e.message);
            return res.status(400).send('Invalid format');
        }

        if (!Array.isArray(items)) {
            return res.status(400).send('Invalid format');
        }

        const projectName = req.body.project_name?.trim();
        if (!projectName) {
            return res.status(400).send('Missing project name');
        }

        console.log
        const quoteId = req.params.quoteid;

        try {
            let quote;

            if (quoteId) {
                // 🔁 Frissítés meglévő dokumentumra
                quote = await QuoteModel.findById(quoteId);
                if (!quote) {
                    return res.status(404).send('Quote not found');
                }

                quote.project_name = projectName;
                quote.items = items;
                console.log(`🟡 Updating quote ${quoteId}`);
            } else {
                // 🆕 Új példány
                quote = new QuoteModel({
                    project_name: projectName,
                    items
                });
                console.log('🟢 Creating new quote');
            }

            await quote.save();
            console.log(`✅ Quote saved (${quote._id})`);
            return res.redirect('/');
        } catch (err) {
            return next(err);
        }
    };
};