const requireOption = require('../common/requireOption');
const path = require('path');
const fs = require('fs');

module.exports = function (objectRepository) {
    const ProductModel = requireOption(objectRepository, 'ProductModel');

    return function (req, res, next) {
        if (
            typeof req.body.name === 'undefined' ||
            typeof req.body.item_number === 'undefined' ||
            typeof req.body.category === 'undefined'
        ) {
            return next(); // nem submitált űrlap, menj tovább
        }

        // Ha nem jött be a termék előre, új példány
        if (!res.locals.product || !res.locals.product._id) {
            res.locals.product = new ProductModel();
            console.log("🟢 Creating new product");
        } else {
            console.log("🟡 Updating existing product: ", res.locals.product._id);
        }

        const product = res.locals.product;

        // Alap mezők
        product.name = req.body.name;
        product.item_number = req.body.item_number;
        product.category = req.body.category;
        product.manufacturer = req.body.manufacturer;
        product.supplier = req.body.supplier;
        if (typeof req.body.price !== 'undefined' && req.body.price !== '') {
            product.price = parseFloat(req.body.price);
        } else if (!product._id) {
            // új termék esetén default 0
            product.price = 0;
        }

        // Diszkrét vs Sheet mezők
        if (req.body.category === 'Discrete') {
            product.subcategory = req.body.subcategory;
            product.in_stock = parseInt(req.body.in_stock, 10) || 0;
            product.sizes = []; // reset sizes if switching type
            product.thickness = undefined;
            product.color = undefined;
        } else if (req.body.category === 'Sheet') {
            product.thickness = parseFloat(req.body.thickness) || 0;
            product.color = req.body.color;
            product.subcategory = undefined;
            product.in_stock = 0; // sheeteknél nincs ilyen mező

            // Méretek feldolgozása
            if (req.body.sizes) {
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
                }).filter(Boolean);
            }
        }

        // Kép
        if (req.file) {
            const oldImagePath = product.image_path;
            const newFilename = req.file.filename;

            if (oldImagePath) {
                const fullPath = path.join('C:/SutheoCompany/images', oldImagePath);
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.warn(`⚠️ Could not delete old image: ${fullPath}`, err.message);
                    } else {
                        console.log(`🗑️ Deleted old image: ${fullPath}`);
                    }
                });
            }

            product.image_path = newFilename;
        }

        // Mentés
        product.save()
            .then(() => {
                console.log(`✅ Product saved (${product._id})`);
                res.redirect(`/product/${product._id}`);
            })
            .catch((err) => next(err));
    };
};