const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const ProductModel = requireOption(objectRepository, 'ProductModel');

    return function (req, res, next) {
        if (
            typeof req.body.name === 'undefined' ||
            typeof req.body.item_number === 'undefined' ||
            typeof req.body.category === 'undefined'
        ) {
            return next();
        }

        if (typeof res.locals.product === 'undefined') {
            res.locals.product = new ProductModel();
        }

        const product = res.locals.product;

        product.name = req.body.name;
        product.item_number = req.body.item_number;
        product.category = req.body.category;
        product.manufacturer = req.body.manufacturer;
        product.supplier = req.body.supplier;

        if (req.body.category === 'discrete') {
            product.subcategory = req.body.subcategory;
            product.in_stock = parseInt(req.body.in_stock, 10) || 0;
        }

        if (req.body.category === 'sheet' && req.body.sizes) {
            const sizeStrings = req.body.sizes
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            product.sizes = sizeStrings.map(entry => {
                const match = entry.match(/^(\d+)[xX](\d+)[xX](\d+)$/);
                if (!match) return null;

                return {
                    height: parseInt(match[1], 10),
                    width: parseInt(match[2], 10),
                    quantity: parseInt(match[3], 10)
                };
            }).filter(Boolean); // kiszűri az érvénytelen sorokat
        }

        if (req.file) {
            product.image_path = `${req.file.filename}`;
        }

        console.log(product);

        product.save()
            .then(() =>
            {
                console.log("124124124")
                res.redirect('/')
            })
            .catch((err) => next(err));
    };
};