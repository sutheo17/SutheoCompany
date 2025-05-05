/*
    Get the list of projects (res.locals.projects)
 */

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
                query = {}; // leader + onlyForLeaders -> all projects
            } else {
                query = { team: user._id }; // non_leader + onlyForLeaders -> just the projects related to the user
            }
        } else {
            query = {}; // onlyForLeaders === false -> everybody can se all projects
        }

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