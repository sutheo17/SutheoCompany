/*
    Save a new transaction or update an existing one.
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const TransactionModel = requireOption(objectRepository, 'TransactionModel');

    return function (req, res, next) {
        const product = res.locals.product;
        const user = req.session.user;
        const transaction = res.locals.transaction || new TransactionModel();

        if (!product || !user) {
            return next(new Error('Missing product or user in saveTransactionMW'));
        }

        const qty = parseInt(req.body.quantity, 10);
        if (isNaN(qty) || qty <= 0) {
            return next(new Error('Invalid quantity provided'));
        }

        let parsedDate = new Date(req.body.date);
        if (!req.body.date || isNaN(parsedDate.getTime())) {
            parsedDate = new Date();
        }

        //checking if the product is sheet
        const isSheet = product.category.toLowerCase() === 'sheet';

        //quantities
        const prevQty = transaction.quantity || 0;
        const diff = qty - prevQty;

        //default fields
        transaction._user = res.locals.transactionUser || user._id;
        transaction.date = parsedDate;
        transaction._product = product._id;
        transaction.quantity = qty;

        //SHEET fields
        if (isSheet) {
            let selectedSize = null;

            //try getting the size by index
            if (typeof req.body.sizeIndex !== 'undefined') {
                const sizeIndex = parseInt(req.body.sizeIndex, 10);
                if (!isNaN(sizeIndex)) {
                    selectedSize = product.sizes?.[sizeIndex];
                }
            }

            //try searching for the size
            if (!selectedSize && transaction.size) {
                selectedSize = product.sizes?.find(size =>
                    size.height === transaction.size.height &&
                    size.width === transaction.size.width
                );
            }

            const newSizeTemplate = transaction.size || {};
            const isReturning = diff < 0;
            const returningQty = Math.abs(diff);

            if (!selectedSize) {
                //if the selected size does not exist anymore add that to the array
                if (isReturning) {
                    selectedSize = {
                        height: newSizeTemplate.height,
                        width: newSizeTemplate.width,
                        quantity: returningQty
                    };
                    product.sizes.push(selectedSize);
                } else {
                    return next(new Error('Trying to take out items from a size that no longer exists.'));
                }
            } else {
                if (!isReturning && selectedSize.quantity < diff) {
                    return next(new Error('Not enough stock in selected size.'));
                }

                //update the in stock
                //if transaction quantity
                //              + -> then remove the amount from stock
                //              - -> add the amount to stock
                selectedSize.quantity -= diff;
            }

            transaction.size = {
                height: selectedSize.height,
                width: selectedSize.width
            };

            return transaction.save()
                .then(() => {
                    //remove sizes which are not in stock anymore
                    product.sizes = product.sizes.filter(size => size.quantity > 0);
                    const isOutOfStock = product.sizes.length === 0;
                    if (isOutOfStock) {
                        res.locals.notifyOutOfStock = true;
                    }
                    return product.save();
                })
                .then(() => next())
                .catch(err => next(err));
        }
        else
        {
            //DISCRETE fields

            //check if we have enough in stock to modify the transaction
            if (product.in_stock < diff) {
                return next(new Error('Not enough items in stock'));
            }

            //update the in stock
            //if transaction quantity
            //              + -> then remove the amount from stock
            //              - -> add the amount to stock
            product.in_stock -= diff;

            return transaction.save()
                .then(() => {
                    const isOutOfStock = product.in_stock === 0;
                    if (isOutOfStock) {
                        res.locals.notifyOutOfStock = true;
                    }
                    return product.save();
                })
                .then(() => next())
                .catch(err => next(err));
        }
    };
};