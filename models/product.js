const Schema = require('mongoose').Schema;
const db = require('../config/db');

const ProductSchema = new Schema({
    name: String,
    item_number: String,
    category: {
        type: String,
        enum: ['discrete', 'sheet'],
        required: true
    },
    subcategory: String,
    manufacturer: String,
    supplier: String,
    in_stock: Number,
    thickness: {
        type: Number,
        validate: {
            validator: function (v) {
                if (this.category === 'sheet') {
                    return v != null;
                }
                return true;
            },
            message: 'Thickness is required for sheet materials.'
        }
    },
    sizes: {
        length: {
            type: Number,
            validate: {
                validator: function (v) {
                    if (this.category === 'sheet') {
                        return v != null;
                    }
                    return true;
                },
                message: 'Length is required for sheet materials.'
            }
        },
        width: {
            type: Number,
            validate: {
                validator: function (v) {
                    if (this.category === 'sheet') {
                        return v != null;
                    }
                    return true;
                },
                message: 'Width is required for sheet materials.'
            }
        }
    }
});

const Product = db.model('Product', ProductSchema);

module.exports = Product;