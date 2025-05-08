module.exports = function (objectRepository) {
    return function (req, res, next) {
        if (!req.params.customerid || !res.locals.projects) {
            return next();
        }

        const customerIdStr = req.params.customerid.toString();

        const matchingProjects = res.locals.projects.filter(project => {
            const cid = project?.customer?._id?.toString?.() || project?.customer?.toString?.();
            return cid === customerIdStr;
        });

        if (matchingProjects.length > 0) {
            const projectNames = matchingProjects.map(p => p.name).join(', ');
            const encodedNames = encodeURIComponent(projectNames);
            return res.redirect(`/customer/modify/${customerIdStr}?used=1&projects=${encodedNames}`);
        }

        return next();
    };
};