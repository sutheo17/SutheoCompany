/*
    Get the projects grouped by counties.
 */

module.exports = function (objectRepository) {

    return function (req, res, next) {
        const projects = res.locals.projects;

        if (!projects || !Array.isArray(projects)) {
            return next(new Error('projects not found in req.body'));
        }

        const countyCounts = {};

        //get the county for each project through the customer field
        projects.forEach(project => {
            const county = project.customer?.county || 'Unknown';
            countyCounts[county] = (countyCounts[county] || 0) + 1;
        });

        //return this dictionary
        res.locals.countyChartData = {
            labels: Object.keys(countyCounts),
            data: Object.values(countyCounts)
        };

        return next();
    };
};