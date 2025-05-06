/*
    Delete a project from the database
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const ProjectModel = requireOption(objectRepository, 'ProjectModel');

    return function (req, res, next) {
        if (typeof req.params.projectid === 'undefined') {
            return next('Project ID is missing');
        }

        ProjectModel.deleteOne({ _id: req.params.projectid })
            .then(() => {
                return res.redirect('/project');
            })
            .catch((err) => {
                return next(err);
            });
    };
};