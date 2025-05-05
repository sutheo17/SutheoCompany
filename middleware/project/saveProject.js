/*
    Save a new project or update an existing one.
 */

const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const ProjectModel = requireOption(objectRepository, 'ProjectModel');

    return async function (req, res, next) {
        const {
            name,
            dateFrom,
            dateTo,
            quote,       // JSON string containing items + prices
            team,
            customer,
            profit,
            calculated_price,
            final_price
        } = req.body;

        //validate the params
        if (!name || !dateFrom || !dateTo || !quote || !team || !customer) {
            res.locals.error = 'All fields need to be given';
            return next();
        }

        let project;

        //check if a project was given
        if (req.params.projectid) {
            project = await ProjectModel.findById(req.params.projectid);
            if (!project) {
                res.locals.error = 'Project not found';
                return next();
            }

            project.profit = profit;
            project.calculated_price = calculated_price;
            project.final_price = final_price;
        } else {
            //creating a new project
            project = new ProjectModel();
        }

        //Save the fields
        project.name = name;
        project.dateFrom = new Date(dateFrom);
        project.dateTo = new Date(dateTo);
        project.quote = quote;
        project.team = Array.isArray(team) ? team : [team]; //check if multiple user was given
        project.customer = customer;


        //Save the project
        project.save()
            .then(() => {
                console.log(`Project saved (${project._id})`);
                res.redirect(`/project`);
            })
            .catch((err) => next(err));
    };
};