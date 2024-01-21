const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keywordGroupSchema = new Schema({
    name: {
        type: String,  
        required: true
    },
    slug: {
        type: String, 
        required: true
    },
    keywords: {
        type: Array,
        required: true
    },
    centralWord: {
        type: String,
        required: true
    },

    analytic: {
        type: Schema.Types.ObjectId,
        ref: 'analytics',
        required: true
    }
});

const KeywordGroup = mongoose.model('keyword_groups', keywordGroupSchema);

module.exports = KeywordGroup;
