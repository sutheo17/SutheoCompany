const renderMW =  require('../middleware/common/render.js')
const checkAuthMW = require("../middleware/auth/checkAuth");

module.exports = function (app) {
    const objectRepository = {};

    app.get('/quote',
        checkAuthMW(true),
        renderMW(objectRepository, 'quote')
    );

    app.get('/project',
        checkAuthMW(),
        renderMW(objectRepository, 'project')
    );

    app.get('/project/add',
        checkAuthMW(true),
        renderMW(objectRepository, 'projectmodify')
    );

    app.get('/project/modify',
        checkAuthMW(true),
        renderMW(objectRepository, 'projectmodify')
    );
};