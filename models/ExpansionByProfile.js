const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expansionByProfileSchema = new Schema({
    expansion: {
        type: Schema.Types.ObjectId,
        ref: 'expansions',
        required: true
    },
    profiles: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: 'profiles',
                required: true
            },
        }
    ],
});


// Middleware para verificar o comprimento de perfis antes de salvar, máximo de 5
expansionByProfileSchema.pre('save', function (next) {
    const maxArrayLength = 5; 

    if (this.profiles && this.profiles.length > maxArrayLength) {
        const error = new Error(`A quantidade máxima de perfis é ${maxArrayLength}.`);
        return next(error);
    }

    next();
});

const ExpansionByProfile = mongoose.model('expansions_by_profile', expansionByProfileSchema);

module.exports = ExpansionByProfile;
