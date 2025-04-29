var renderMW =  require('../middleware/common/render.js')

module.exports = function (app) {
    var objectRepository = {};

    app.get('/quote',
        renderMW(objectRepository, 'quote')
    );

    app.get('/project',
        renderMW(objectRepository, 'project')
    );

    app.get('/project/add',
        renderMW(objectRepository, 'projectmodify')
    );

    app.get('/project/modify',
        renderMW(objectRepository, 'projectmodify')
    );
};