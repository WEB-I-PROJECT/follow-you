const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userIdentify: {
        type: String,
        required: true,
        unique: true,
    },
    urlImg: {
        type: String,
        required: true
    },
});

const Profile = mongoose.model('profiles', profileSchema);

module.exports = Profile;
