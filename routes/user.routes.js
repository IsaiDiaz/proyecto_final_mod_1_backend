const express = require('express');
const router = express.Router();
const { createUser, getUserById, updateUser, authPassword, refreshToken } = require('../controllers/user.controller');

router.post('/user', createUser);
router.get('/user/:id', getUserById);
router.put('/user/:id', updateUser);
router.post('/auth_password', authPassword)
router.post('/refresh-token', refreshToken)


module.exports = router;