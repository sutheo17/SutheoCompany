/*
    Login the user using session library (req.session.user)
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    return function (req, res, next) {
        const UserModel = requireOption(objectRepository, 'UserModel');

        if (req.method === 'POST') {
            const { username, password } = req.body;

            UserModel.findOne({ username, password })
                .then((user) => {
                    if (!user) {
                        return res.redirect('/login');
                    }

                    //save the user info into the session
                    req.session.user = user;
                    return res.redirect('/');
                })
                .catch((err) => {
                    return next(err);
                });

        } else {
            return res.redirect('/');
        }
    };
};