const requireOption = require('../common/requireOption');

module.exports = function (objectRepository, onlyForLeaders) {
    const ProjectModel = requireOption(objectRepository, 'ProjectModel');

    return function (req, res, next) {
        const user = res.locals.user;

        if (!user) {
            return next(new Error('User not found in res.locals'));
        }

        let query = {};

        if (onlyForLeaders) {
            if (user.leader) {
                query = {}; // leader + onlyForLeaders: minden projekt
            } else {
                query = { team: user._id }; // nem leader + onlyForLeaders: csak saját
            }
        } else {
            query = {}; // onlyForLeaders === false => mindenki lát mindent
        }

        ProjectModel.find(query)
            .populate('team')
            .populate('customer')
            .then((projects) => {
                console.log(projects);
                res.locals.projects = projects;
                return next();
            })
            .catch((err) => {
                return next(err);
            });
    };
};