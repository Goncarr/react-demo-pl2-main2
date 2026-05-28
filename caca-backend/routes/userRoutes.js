const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { verificarToken, apenasAdmins } = require('../middlewares/authMiddleware');
const User = require('../models/User'); 

// Rota para visualização do perfil 
router.get('/perfil', verificarToken, (req, res) => {
    res.status(200).json({ message: 'Acesso autorizado ao perfil.', dadosDoToken: req.user });
});

// Rota definida para atualizar o perfil
router.put('/perfil', verificarToken, async (req, res) => {
    try {
        const { nome, password } = req.body;
        
        // Verifica se o utilizador existe
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });

        if (nome) user.nome = nome;
        
        // Encripta a password caso tenha sido inserida
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({
            message: 'Perfil atualizado com sucesso!',
            user: { id: user._id, nome: user.nome, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o perfil.' });
    }
});

module.exports = router;    