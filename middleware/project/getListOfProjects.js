const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const ProjectModel = requireOption(objectRepository, 'ProjectModel');

    return function (req, res, next) {
        const user = res.locals.user;

        if (!user) {
            return next(new Error('User not found in res.locals'));
        }

        const query = user.leader
            ? {} // minden projekt
            : { team: user._id }; // csak ahol benne van a team-ben

        ProjectModel.find(query)
            .then((projects) => {
                res.locals.projects = projects;
                return next();
            })
            .catch((err) => {
                return next(err);
            });
    };
};