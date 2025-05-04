const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {

    const UserModel = requireOption(objectRepository, 'UserModel');

    return function (req, res, next) {
        UserModel.findOne({username: res.locals.user.username})
            .then((user) =>
            {
                res.locals.transactionUser = user;
                return next();
            }).catch((err) => {return next(err)});
    };

};