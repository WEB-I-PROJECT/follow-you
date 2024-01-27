const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String, // ex: Desenvolvimento De Sistemas Web 
        required: true
    },
    slug: {
        type: String, // ex: desenvolvimento-de-sistemas-web
        required: true
    },
    keywords: {
        type: Array,
        required: true
    },
    imgPath: {
        type: String,
        required: false
    },

});

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;
