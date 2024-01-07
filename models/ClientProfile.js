const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientProfileSchema = new Schema({
    cpf: {
        type: String,
        required: true,
        unique: true,
        maxlength: 14 // ex: 100.273.849-08
    },
    phone: {
        type: String,
        required: true,
        maxlength: 17  // ex: +55 77 99121-6617
    },
    address: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
});

const ClientProfile = mongoose.model('client_profiles', clientProfileSchema);

module.exports = ClientProfile;
