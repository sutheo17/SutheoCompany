const renderMW =  require('../middleware/common/render.js')
const loginMW = require('../middleware/common/login');
const checkAuthMW = require('../middleware/common/checkAuth');

const UserModel = require('../models/user');

module.exports = function (app) {
    const objectRepository = {
        UserModel: UserModel
    };

    // Login oldal megjelenítése
    app.get('/login',
        renderMW(objectRepository, 'login')
    );

    // Login POST feldolgozása
    app.post('/login',
        loginMW(objectRepository),
        (req, res) => res.redirect('/')
    );

    app.post('/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) return next(err);
            res.redirect('/login');
        });
    });

    app.get('/trends',
        checkAuthMW(false),
        renderMW(objectRepository, 'trends')
    );

    app.get('/',
        checkAuthMW(false),
        renderMW(objectRepository, 'index')
    );
};