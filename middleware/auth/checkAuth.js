/*
    Checks if the user is logged in -> if not then it redirects them to the login page
 */

module.exports = function (leader) {
    return function (req, res, next) {
        if (!req.session.user) {
            //if the user is not logged in redirect them to the login page
            return res.redirect('/login');
        } else {
            if (leader && !req.session.user.leader) {
                //if the page is admin only the redirect the user
                return res.redirect(req.headers.referer || '/');
            }
        }
        return next();
    };
};