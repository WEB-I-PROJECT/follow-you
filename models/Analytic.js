const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analyticSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    type: {
        type: String, // by-keywords ou by-category
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: false
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: false
    }
});

// Middleware para verificar se o campo 'type' é válido
analyticSchema.pre('save', function(next) {
    const validTypes = ['by-keywords', 'by-category'];
    if (!validTypes.includes(this.type)) {
        const error = new Error('Tipo inválido. Deve ser "by-keywords" ou "by-category".');
        return next(error);
    }
    next();
});


const Analytic = mongoose.model('analytics', analyticSchema);

module.exports = Analytic;