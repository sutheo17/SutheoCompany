const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const TransactionModel = requireOption(objectRepository, 'TransactionModel');

    return function (req, res, next) {
        const product = res.locals.product;
        const user = req.session.user;

        if (!product || !user) {
            return next(new Error('Missing product or user in saveTransactionMW'));
        }

        const qty = parseInt(req.body.quantity, 10);
        if (isNaN(qty) || qty <= 0) {
            return next(new Error('Invalid quantity provided'));
        }

        // Ha a termék sheet típusú
        if (product.category.toLowerCase() === 'sheet') {
            const sizeIndex = parseInt(req.body.sizeIndex, 10);

            if (
                isNaN(sizeIndex) ||
                !product.sizes ||
                !product.sizes[sizeIndex] ||
                qty > product.sizes[sizeIndex].quantity
            ) {
                return next(new Error('Invalid sheet size or quantity'));
            }

            const selectedSize = product.sizes[sizeIndex];

            const transaction = new TransactionModel({
                user: user.username,
                date: new Date(),
                _product: product._id,
                quantity: qty,
                size: {
                    height: selectedSize.height,
                    width: selectedSize.width
                }
            });

            return transaction.save()
                .then(() => {
                    // Csökkentjük a kiválasztott méret készletét
                    selectedSize.quantity -= qty;
                    return product.save();
                })
                .then(() => {
                    res.redirect('/');
                })
                .catch((err) => next(err));

        } else {
            // Diszkrét termék kezelése
            if (qty > product.in_stock) {
                return next(new Error('Quantity exceeds available stock'));
            }

            const transaction = new TransactionModel({
                user: user.username,
                date: new Date(),
                _product: product._id,
                quantity: qty
            });

            return transaction.save()
                .then(() => {
                    product.in_stock -= qty;
                    return product.save();
                })
                .then(() => {
                    res.redirect('/');
                })
                .catch((err) => next(err));
        }
    };
};
