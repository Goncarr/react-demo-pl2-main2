const mongoose = require('mongoose');

/*
Schema para o utilizadores. Define um utilizador com role 'user'
por defeito.
*/

const userSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: [true, 'O nome é obrigatório'] 
    },
    email: { 
        type: String, 
        required: [true, 'O email é obrigatório'], 
        unique: true 
    },
    password: { 
        type: String, 
        required: [true, 'A palavra-passe é obrigatória'] 
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);