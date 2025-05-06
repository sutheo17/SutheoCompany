/*
    Print a summary pdf.
*/

const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

module.exports = function () {
    return async function (req, res, next) {
        try {
            const project = res.locals.project;
            const items = res.locals.quoteProducts;

            console.log("itt")

            const now = new Date();
            const pad = (n) => n.toString().padStart(2, '0');

            //printed date
            const printedDate = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}.`;

            const html = await ejs.renderFile(
                path.join(__dirname, '../../views/summary.ejs'),
                { project, items, path, printedDate }
            );

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

            //filename date
            const formattedDate = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
            const safeProjectName = project.name.replace(/[^a-z0-9]/gi, '_');

            const filename = `${safeProjectName}_${formattedDate}.pdf`;

            const savePath = `C:/SutheoCompany/summaries/${filename}`;

            await page.pdf({
                path: savePath,
                format: 'A4',
                printBackground: true
            });

            await browser.close();

            // Redirect back to the project modify page
            return res.redirect(`/project/modify/${project._id}?printed=1`);


        } catch (err) {
            return next(err);
        }
    };
};