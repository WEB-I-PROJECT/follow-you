const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//tirei as a palavra central não precisa, só atrapalha
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
    analytic: {
        type: Schema.Types.ObjectId,
        ref: 'analytics',
        required: true
    }
});

const KeywordGroup = mongoose.model('keyword_groups', keywordGroupSchema);

module.exports = KeywordGroup;
