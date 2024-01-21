const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: {
        type: String,  
        required: true
    },
    content: {
        type: String, 
        required: true
    },
    Origin: {
        type: String,
        required: true
    },
    keywords: {
        type: Array,
        required: true
    
    },
    tags: {
        type: Array,
        default: []
    },
    
    analytic: {
        type: Schema.Types.ObjectId,
        ref: 'analytics',
    },

    keywordGroup: {
        type: Schema.Types.ObjectId,
        ref: 'keyword_groups',
    }
});

newsSchema.pre('save', function(next) {
    if (!this.analytic && !this.keywordGroup) {
        const error = new Error('É necessário que a notícia esteja associada à um Analytic ou Grupo de Palavras Chaves');
        return next(error);
    }
    next();
});


const News = mongoose.model('news', newsSchema);

module.exports = News;
