/*
    Enrich res.locals.project.quote.items with product data
*/

module.exports = function () {
    return function (req, res, next) {
        const project = res.locals.project;
        const products = res.locals.products;

        if (!project || !project.quote || !project.quote.items || !Array.isArray(products)) {
            return next(new Error('Missing project, quote items, or products'));
        }

        // Connect them via item_number
        res.locals.quoteProducts = project.quote.items.map(item => {
            const product = products.find(p => p.item_number === item.item_number);
            const unitPrice = product?.price || 0;

            return {
                item_number: item.item_number,
                quantity: item.quantity,
                product_name: product?.name || item.item_number,
                unit_price: unitPrice,
                total: unitPrice * item.quantity
            };
        });

        return next();
    };
};