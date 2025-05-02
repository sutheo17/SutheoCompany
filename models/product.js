const Schema = require('mongoose').Schema;
const db = require('../config/db');

const ProductSchema = new Schema({
    name: String,
    item_number: String,
    category: String,
    image_path: String,
    subcategory: String,
    color: String,
    manufacturer: String,
    supplier: String,
    in_stock: Number,
    thickness: Number,
    sizes: [{
        height: Number,
        width: Number,
        quantity: Number
    }],
    price: Number
});

const Product = db.model('Product', ProductSchema);

module.exports = Product;