/*
    Render HTML pages
 */

module.exports = function (objectRepository, viewName) {
    return function (req, res) {
        console.log('Rendering ' + viewName);
        res.render(viewName);
    };

};