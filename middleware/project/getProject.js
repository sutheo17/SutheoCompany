/*
    Get a single project (res.locals.project)
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {

    const ProjectModel = requireOption(objectRepository, 'ProjectModel');

    return function (req, res, next) {
        ProjectModel.findOne({_id:req.params.projectid})
            .populate('quote')
            .populate('customer')
            .populate('team')
            .then((project) =>
            {
                res.locals.project = project;
                return next();
            }).catch((err) => {return next(err)});
    };

};