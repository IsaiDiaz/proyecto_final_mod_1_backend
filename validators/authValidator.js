const { body } = require('express-validator');

exports.validateLogin = [
    body('email')
        .isEmail().withMessage('El correo electrónico no es valido'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
]

exports.validateRegister = [
    body('email')
        .isEmail().withMessage('Debe ser un correo válido'),
    body('password')
        .isLength({min:6}).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')

]