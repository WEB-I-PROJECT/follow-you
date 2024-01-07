const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    analytic: {
        type: Schema.Types.ObjectId,
        ref: 'analytics',
        required: true
    },
    userIdentify: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    comments: [
        {
            userIdentify: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            },
            likes: {
                type: Number,
                required: true
            }
        }
    ]
});

const Post = mongoose.model('posts', postSchema);

module.exports = Post;
