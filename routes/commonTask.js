var renderMW =  require('../middleware/common/render.js')

module.exports = function (app) {
    var objectRepository = {};

    app.get('/login',
        renderMW(objectRepository, 'login')
    );

    app.get('/trends',
        renderMW(objectRepository, 'trends')
    );

    app.get('/',
        renderMW(objectRepository, 'index')
    );
};