var renderMW =  require('../middleware/common/render.js')

module.exports = function (app) {
    var objectRepository = {};

    app.get('/customer',
        renderMW(objectRepository, 'customer')
    );

    app.get('/customer/add',
        renderMW(objectRepository, 'customermodify')
    );

    app.get('/customer/modify',
        renderMW(objectRepository, 'customermodify')
    );
};