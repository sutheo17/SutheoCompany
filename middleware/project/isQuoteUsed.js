module.exports = function (objectRepository) {
    return function (req, res, next) {
        if (!req.params.quoteid || !res.locals.projects) {
            return next();
        }

        const quoteIdString = req.params.quoteid.toString();

        const matchingProjects = res.locals.projects.filter(project => {
            const cid = project?.quote?._id?.toString?.() || project?.quote?.toString?.();
            return cid === quoteIdString;
        });

        if (matchingProjects.length > 0) {
            const projectNames = matchingProjects.map(p => p.name).join(', ');
            const encodedNames = encodeURIComponent(projectNames);
            return res.redirect(`/quote/?used=1&projects=${encodedNames}`);
        }

        return next();
    };
};