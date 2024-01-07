const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expansionByCategorySchema = new Schema({
    expansion: {
        type: Schema.Types.ObjectId,
        ref: 'expansions',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    }
});

const ExpansionByCategory = mongoose.model('expansions_by_category', expansionByCategorySchema);

module.exports = ExpansionByCategory;
