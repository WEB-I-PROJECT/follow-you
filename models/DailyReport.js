const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyReportSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    userFollowed: [
       {
            userIndetidy: {
                type: String,
                required: true
            }
       }
    ],
    initialFollowers: {
        type: Number,
        required: true
    },
    finalFollowers: {
        type: Number,
        required: true
    },
    segmentationChecker: [
        {
            userIndetidy: {
                type: String,
                required: true
            },
            category: {
                type: Schema.Types.ObjectId,
                ref: 'categories',
                default: null
            }
        }
     ],
    newPosts: {
        type: Number,
        default: 0
    },
    expansion: {
        type: Schema.Types.ObjectId,
        ref: 'expansion',
        required: true
    }

});

const DailyReport = mongoose.model('daily_reports', dailyReportSchema);

module.exports = DailyReport;
