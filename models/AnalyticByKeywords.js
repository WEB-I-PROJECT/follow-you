const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analyticByKeywordsSchema = new Schema({
    analytic: {
        type: Schema.Types.ObjectId,
        ref: 'analytics',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    keywords: [
        {
            name: {
                type: String,
                required: true
            },
        }
    ],
});


const AnalyticByKeywords = mongoose.model('analytics_by_keywords', analyticByKeywordsSchema);

module.exports = AnalyticByKeywords;
