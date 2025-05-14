const express = require('express');
const router = express.Router();
const { createUser, getUserById, updateUser, authPassword, refreshToken, logout } = require('../controllers/user.controller');
const {validateLogin, validateRegister} = require('../validators/authValidator')
const handleValidation = require('../middlewares/validate');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/user', validateRegister, handleValidation, createUser);
router.get('/user/:id',authMiddleware, getUserById);
router.put('/user/:id', authMiddleware, updateUser);
router.post('/auth_password', validateLogin, handleValidation, authPassword)
router.post('/refresh-token', refreshToken)
router.post('/logout', logout)


module.exports = router;