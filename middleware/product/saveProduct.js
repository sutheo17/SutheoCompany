/*
    Save product or update an existing one.
 */

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
            return next();
        }

        var newProduct = false

        //check if a product was given
        if (!res.locals.product || !res.locals.product._id) {
            res.locals.product = new ProductModel();
            newProduct = true;
        }

        const product = res.locals.product;

        //default fields
        product.name = req.body.name;
        product.item_number = req.body.item_number;
        product.category = req.body.category;
        product.manufacturer = req.body.manufacturer;
        product.supplier = req.body.supplier;


        if (newProduct) {
            product.price = 0
        }
        else
        {
            product.price = res.locals.product.price;
        }

        //DISCRETE fields
        if (req.body.category === 'Discrete') {
            product.subcategory = req.body.subcategory;
            product.in_stock = parseInt(req.body.in_stock, 10) || 0;
        //SHEET fields
        } else if (req.body.category === 'Sheet') {
            product.thickness = parseFloat(req.body.thickness) || 0;
            product.color = req.body.color;

            //Add the sizes as objects
            if (req.body.sizes) {
                const sizeStrings = req.body.sizes
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);

                product.sizes = sizeStrings.map(entry => {
                    //string is [height]x[width]x[pcs] form
                    const match = entry.match(/^(\d+)[xX](\d+)[xX](\d+)$/);
                    if (!match) return null;

                    return {
                        height: parseInt(match[1], 10),
                        width: parseInt(match[2], 10),
                        quantity: parseInt(match[3], 10)
                    };
                }).filter(Boolean); //filter bad format strings
            }
        }

        //image
        if (req.file) {
            const oldImagePath = product.image_path;
            const newFilename = req.file.filename;

            //delete the old image
            if (oldImagePath) {
                const fullPath = path.join('C:/SutheoCompany/images', oldImagePath);
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.warn(`Could not delete old image: ${fullPath}`, err.message);
                    } else {
                        console.log(`Deleted old image: ${fullPath}`);
                    }
                });
            }

            //add the new image
            product.image_path = newFilename;
        }

        //Save the product
        product.save()
            .then(() => {
                console.log(`Product saved (${product._id})`);
                res.redirect(`/product/${product._id}`);
            })
            .catch((err) => next(err));
    };
};