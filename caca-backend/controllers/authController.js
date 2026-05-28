const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//registo do utilizador
exports.register = async (req, res) => {
    try {
        const { nome, email, password, role } = req.body;

        //Validaça de entrada dos dados
        if (!nome || !email || !password) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
        }

        //Verificar se o utilizador já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Este email já está registado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            nome,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        res.status(201).json({ message: 'Utilizador registado com sucesso!' });

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.', error: error.message });
    }
};

// Login do utilizador
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Verifica se o utilizador existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login efetuado com sucesso!',
            token,
            user: { id: user._id, nome: user.nome, email: user.email, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.', error: error.message });
    }
};