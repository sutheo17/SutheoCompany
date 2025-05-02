const Schema = require('mongoose').Schema;
const db = require('../config/db');

const ProductSchema = new Schema({
    name: String,
    item_number: String,
    category: String, // enum nélkül
    image_path: String,
    subcategory: String,
    manufacturer: String,
    supplier: String,
    in_stock: Number,
    thickness: Number,
    sizes: [{
        height: Number,
        width: Number,
        quantity: Number
    }]
});

const Product = db.model('Product', ProductSchema);

module.exports = Product;