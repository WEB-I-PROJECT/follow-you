const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analyticByProfileSchema = new Schema({
    analytic: {
        type: Schema.Types.ObjectId,
        ref: 'analytics',
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
analyticByProfileSchema.pre('save', function (next) {
    const maxArrayLength = 5; 

    if (this.profiles && this.profiles.length > maxArrayLength) {
        const error = new Error(`A quantidade máxima de perfis é ${maxArrayLength}.`);
        return next(error);
    }

    next();
});


const AnalyticByProfile = mongoose.model('analytics_by_profile', analyticByProfileSchema);

module.exports = AnalyticByProfile;
