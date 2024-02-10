const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
    },
    
    address: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    approved: { 
        type: Boolean, 
        default: true 
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

// Middleware para definir createdAt apenas uma vez durante a criação do usuário
userSchema.pre('save', function(next) {
    if (this.isNew) {
        this.createdAt = this.updatedAt = Date.now();
    } else {
        this.updatedAt = Date.now();
    }
    next();
});

const User = mongoose.model('users', userSchema);

module.exports = User;
