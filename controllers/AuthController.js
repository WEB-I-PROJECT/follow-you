const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthController {
    async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                throw new Error('Credenciais inválidas');
            }

            const token = jwt.sign({ userId: user._id }, 'seu_segredo_jwt', { expiresIn: '1h' });

            res.json({ token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    try {

        const decoded = jwt.verify(token, 'seu_segredo_jwt');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token de autenticação inválido' });
    }
};

module.exports = { AuthController, verifyToken };
