/*
    Log out the user
 */

const requireOption = require("../common/requireOption");
module.exports = function () {
    return function (req, res, next) {
        req.session.destroy(err => {
            if (err) return next(err);
            res.redirect('/login');
        });
    };
};