const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/auth/checkAuth");
const saveTransactionMW =  require('../middleware/transaction/saveTransaction.js')
const getListOfTransactionMW =  require('../middleware/transaction/getListOfTransaction.js')
const ProductModel = require("../models/product");
const TransactionModel = require("../models/transaction");const getProductMW = require("../middleware/product/getProduct");

module.exports = function (app) {
    const objectRepository = {
        ProductModel: ProductModel,
        TransactionModel: TransactionModel
    };

    app.post('/transaction/add/:productid',
        checkAuthMW(false),
        getProductMW(objectRepository),
        saveTransactionMW(objectRepository)
    );

    app.get('/transaction/:productid',
        checkAuthMW(false),
        getProductMW(objectRepository),
        getListOfTransactionMW(objectRepository),
        renderMW(objectRepository, 'transaction')
    );

    app.get('/transaction/product/modify',
        checkAuthMW(true),
        renderMW(objectRepository, 'transactionmodify')
    );
};