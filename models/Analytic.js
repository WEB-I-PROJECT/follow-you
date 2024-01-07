const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analyticSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    instagramAccount: {
        type: Schema.Types.ObjectId,
        ref: 'instagram_accounts',
        required: true
    }
});

const Analytic = mongoose.model('analytics', analyticSchema);

module.exports = Analytic;
