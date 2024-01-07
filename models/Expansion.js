const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expansionSchema = new Schema({
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

const Expansion = mongoose.model('expansions', expansionSchema);

module.exports = Expansion;
