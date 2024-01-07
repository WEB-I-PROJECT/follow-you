const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postCheckerSchema = new Schema({
    initialLikes: {
        type: Number,
        required: true
    },
    finalLikes: {
        type: Number,
        required: true
    },
    initialComments: {
        type: Number,
        required: true
    },
    finalComments: {
        type: Number,
        required: true
    },
});

const PostChecker = mongoose.model('post_checkers', postCheckerSchema);

module.exports = PostChecker;
