const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instagramAccountSchema = new Schema({
    userIndentfy: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    urlImg: {
        type: String,
        required: true
    },
    initialFollowers: {
        type: Number,
        required: true
    },
    actualFollowers: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
});

const InstagramAccount = mongoose.model('instagram_accounts', instagramAccountSchema);

module.exports = InstagramAccount;
