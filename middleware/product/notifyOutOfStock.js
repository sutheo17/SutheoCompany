const requireOption = require('../common/requireOption');
const nodemailer = require('nodemailer');

module.exports = function (objectRepository) {
    const ProductModel = requireOption(objectRepository, 'ProductModel');
    const UserModel = requireOption(objectRepository, 'UserModel');

    return function (req, res, next) {

        console.log('Notify beee');
        //check if the product became out of stock
        if (!res.locals.notifyOutOfStock) {
            console.log('Notify xdxd');
            return res.redirect(`/`)
        }

        console.log('Notify OutOfStock');

        ProductModel.findOne({ _id: req.params.productid })
            .then((product) => {
                if (!product) return next(new Error('Product not found!'));

                //query the users
                return UserModel.find({ leader: true })
                    .then((leaders) => {
                        if (!leaders || leaders.length === 0) {
                            console.warn('No leaders found.');
                            return next();
                        }

                        const recipientEmails = leaders.map(user => user.email).filter(Boolean);
                        if (recipientEmails.length === 0) {
                            console.warn('Leaders have no email address.');
                            return next();
                        }

                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL_USER,
                                pass: process.env.EMAIL_PASS
                            }
                        });

                        const mailOptions = {
                            from: 'sutheo.noreply@gmail.com',
                            to: recipientEmails.join(','),
                            subject: 'Stock Alert: Product Out of Stock',
                            text: `The following item is out of stock:\n\nName: ${product.name}\nItem number: ${product.item_number}\n\nTHIS EMAIL WAS AUTOMATICALLY SENT, DON'T REPLY`
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('Email sending error:', error);
                            } else {
                                console.log('Email sent:', info.response);
                            }
                        });

                        return res.redirect('/');
                    });
            })
            .catch((err) => next(err));
    };
};