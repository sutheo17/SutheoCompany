const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const ProjectModel = requireOption(objectRepository, 'ProjectModel');

    return function (req, res, next) {
        const projects = res.locals.projects;

        if (!projects || !Array.isArray(projects)) {
            return next(new Error('projects not found in req.body'));
        }

        const countyCounts = {};

        projects.forEach(project => {
            const county = project.customer?.county || 'Ismeretlen';
            countyCounts[county] = (countyCounts[county] || 0) + 1;
        });

        console.log("lefut")

        // Készítsük elő a chart.js-hez szükséges adatokat
        res.locals.countyChartData = {
            labels: Object.keys(countyCounts),
            data: Object.values(countyCounts)
        };

        return next();
    };
};