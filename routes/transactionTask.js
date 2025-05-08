const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/auth/checkAuth");
const saveTransactionMW =  require('../middleware/transaction/saveTransaction.js')
const getListOfTransactionMW =  require('../middleware/transaction/getListOfTransaction.js')
const getListOfUserMW =  require('../middleware/common/getListOfUser.js')
const getTransactionMW =  require('../middleware/transaction/getTransaction.js')
const getUserMW =  require('../middleware/common/getUser.js')
const ProductModel = require("../models/product");
const TransactionModel = require("../models/transaction");
const UserModel = require("../models/user");
const getProductMW = require("../middleware/product/getProduct");
const notifyOutOfStockMW = require("../middleware/product/notifyOutOfStock.js");

module.exports = function (app) {
    const objectRepository = {
        ProductModel: ProductModel,
        TransactionModel: TransactionModel,
        UserModel: UserModel
    };

    // Save the modifications made to the transaction
    app.post('/transaction/save/:productid/:transactionid?',
        checkAuthMW(false),
        getProductMW(objectRepository),
        getTransactionMW(objectRepository),
        getUserMW(objectRepository),
        saveTransactionMW(objectRepository),
        notifyOutOfStockMW(objectRepository)
    );

    // Transactions for a certain product
    app.get('/transaction/:productid',
        checkAuthMW(false),
        getProductMW(objectRepository),
        getListOfTransactionMW(objectRepository),
        renderMW(objectRepository, 'transaction')
    );

    // Modify a transaction
    app.get('/transaction/modify/:productid/:transactionid',
        checkAuthMW(true),
        getListOfUserMW(objectRepository),
        getTransactionMW(objectRepository),
        renderMW(objectRepository, 'transactionmodify')
    );
};