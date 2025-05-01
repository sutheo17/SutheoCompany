/*
    Render HTML pages
 */

module.exports = function (objectrepository, viewName) {
    return function (req, res) {
        console.log('Rendering ' + viewName);
        res.render(viewName);
    };

};