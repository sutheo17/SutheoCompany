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

        const isSheet = product.category.toLowerCase() === 'sheet';
        const isNew = transaction.isNew;
        const prevQty = transaction.quantity || 0;
        const diff = qty - prevQty;

        console.log(qty)
        console.log(prevQty);
        console.log(diff)

        // Tranzakció mezők (közös)
        transaction._user = res.locals.transactionUser || user._id;
        transaction.date = parsedDate;
        transaction._product = product._id;
        transaction.quantity = qty;

        if (isSheet) {
            let selectedSize = null;

            // Próbáljuk sizeIndex alapján
            if (typeof req.body.sizeIndex !== 'undefined') {
                const sizeIndex = parseInt(req.body.sizeIndex, 10);
                if (!isNaN(sizeIndex)) {
                    selectedSize = product.sizes?.[sizeIndex];
                }
            }

            // Próbáljuk visszakeresni meglévő size alapján
            if (!selectedSize && transaction.size) {
                selectedSize = product.sizes?.find(size =>
                    size.height === transaction.size.height &&
                    size.width === transaction.size.width
                );
            }

            const newSizeTemplate = transaction.size || {}; // biztonság kedvéért
            const isReturning = diff < 0;
            const returningQty = Math.abs(diff);

            if (!selectedSize) {
                // Ha visszatöltünk és méret már nincs, újra létrehozzuk
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

                selectedSize.quantity -= diff; // működik mindkét irányban (negatív = növel)
            }

            transaction.size = {
                height: selectedSize.height,
                width: selectedSize.width
            };

            return transaction.save()
                .then(() => {
                    product.sizes = product.sizes.filter(size => size.quantity > 0);
                    return product.save();
                })
                .then(() => res.redirect(`/`))
                .catch(err => next(err));
        }


        // --- DISCRETE logika ---
        if (product.in_stock < diff) {
            return next(new Error('Not enough items in stock'));
        }

        product.in_stock -= diff;

        return transaction.save()
            .then(() => product.save())
            .then(() => res.redirect(`/`))
            .catch(err => next(err));
    };
};