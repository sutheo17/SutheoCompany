const requireOption = require('../common/requireOption');

module.exports = function (objectRepository) {
    const ProjectModel = requireOption(objectRepository, 'ProjectModel');

    return async function (req, res, next) {
        const {
            name,
            dateFrom,
            dateTo,
            quote,
            team,
            customer
        } = req.body;

        // Validáció
        if (!name || !dateFrom || !dateTo || !quote || !team || !customer) {
            res.locals.error = 'Minden mezőt ki kell tölteni!';
            return next(); // Render a 'projectmodify' view hibával
        }

        try {
            let project;

            if (req.params.projectid) {
                // Létező projekt módosítása
                project = await ProjectModel.findById(req.params.projectid);
                if (!project) {
                    res.locals.error = 'Projekt nem található!';
                    return next();
                }
            } else {
                // Új projekt létrehozása
                project = new ProjectModel();
            }

            // Mezők mentése
            project.name = name;
            project.dateFrom = new Date(dateFrom);
            project.dateTo = new Date(dateTo);
            project.quote = quote;
            project.team = Array.isArray(team) ? team : [team]; // Ha csak egy user van kiválasztva
            project.customer = customer;

            await project.save();

            return res.redirect('/project');
        } catch (err) {
            console.error(err);
            res.locals.error = 'Hiba történt a mentés során.';
            return next(); // Render hibával
        }
    };
};