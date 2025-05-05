/*
    Get the user list (res.locals.users)
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {

    const UserModel = requireOption(objectRepository, 'UserModel');

    return function (req, res, next) {
        UserModel.find({}).then((users) => {
            res.locals.users = users;
            return next();
        }).catch((err) => {return next(err)
        });
    };

};