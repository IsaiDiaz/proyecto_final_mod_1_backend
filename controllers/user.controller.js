const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

exports.authPassword = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Cuerpo de la solicitud vacío o malformado' });
        }
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'El correo electrónico y la contraseña son obligatorios' });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' });

        const tokens = generateTokens(user);

        res
            .cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 
            })
            .status(200)
            .json({
                user: { id: user.id, email: user.email },
                accessToken: tokens.accessToken 
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { password, email, ...rest } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'El correo electrónico es obligatorio' });
        }

        const existingUser = await User.findOne({ where : {email}  });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está en uso' });
        }


        if (!password) {
            return res.status(400).json({ message: 'La contraseña es obligatoria' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            ...rest,
email: email,
            password: hashedPassword
        });

        const userSafe = { ...user._doc };
        delete userSafe.password;

        res.status(201).json(userSafe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
}

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await user.update(req.body);
    res.json(user);
}


exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: "No se envió token" });

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(403).json({ message: "Usuario inválido" });

        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ token: newAccessToken });
    } catch (err) {
        console.error("Error al refrescar token:", err);
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};

exports.logout = async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/" 
    });

    res.status(200).json({ message: "Sesión cerrada correctamente" });
};