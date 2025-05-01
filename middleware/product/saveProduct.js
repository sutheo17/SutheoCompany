const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const ProductModel = requireOption(objectRepository, 'ProductModel');

    return function (req, res, next) {
        if (
            typeof req.body.name === 'undefined' ||
            typeof req.body.item_number === 'undefined' ||
            typeof req.body.category === 'undefined'
        ) {
            return next(); // hiányos adat -> render page újra
        }

        if (typeof res.locals.product === 'undefined') {
            res.locals.product = new ProductModel();
        }

        const product = res.locals.product;

        console.log(product)

        product.name = req.body.name;
        product.item_number = req.body.item_number;
        product.category = req.body.category;
        product.manufacturer = req.body.manufacturer;
        product.supplier = req.body.supplier;

        if (req.body.category === 'discrete') {
            product.subcategory = req.body.subcategory;
            product.in_stock = parseInt(req.body.in_stock, 10) || 0;
        }

        if (req.body.category === 'sheet') {
            product.color = req.body.color;
            product.thickness = parseFloat(req.body.thickness);

            const sizeMatch = req.body.sizes?.match(/^(\d+)[xX](\d+)[xX](\d+)$/);
            if (sizeMatch) {
                product.sizes = {
                    length: parseInt(sizeMatch[1], 10),
                    width: parseInt(sizeMatch[2], 10)
                };
            }
        }

        // ha fájl jön (multer már dolgozott)
        if (req.file) {
            product.image_path = `/images/${req.file.filename}`;
        }

        product.save()
            .then(() =>
            {
                console.log("124124124")
                res.redirect('/')
            })
            .catch((err) => next(err));
    };
};