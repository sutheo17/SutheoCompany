var renderMW =  require('../middleware/common/render.js')

module.exports = function (app) {
    var objectRepository = {};

    app.get('/pricing',
        renderMW(objectRepository, 'pricing')
    );

    app.get('/pricing/modify',
        renderMW(objectRepository, 'pricingmodify')
    );

    app.get('/product',
        renderMW(objectRepository, 'product')
    );

    app.get('/product/add',
        renderMW(objectRepository, 'productmodify')
    );

    app.get('/product/modify',
        renderMW(objectRepository, 'productmodify')
    );
};