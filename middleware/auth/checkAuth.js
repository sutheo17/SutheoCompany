/*
    Checks if the user is logged in -> if not then it redirects them to the login page
 */

module.exports = function (leader) {
    return function (req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login');
        } else {
            if (leader && !req.session.user.leader) {
                // Ha jogosultság hiányzik, vissza az előző oldalra
                return res.redirect(req.headers.referer || '/');
            }
        }
        return next();
    };
};