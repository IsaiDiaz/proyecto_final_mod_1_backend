const express = require('express');
const router = express.Router();
const { createTask, getTasksByUserId, getTaskById, updateTask, updateProgress, deleteTask, getTodayTasksByUserId } = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/task', authMiddleware, createTask);
router.get('/tasks/', authMiddleware, getTasksByUserId);
router.get('/tasks/today', authMiddleware, getTodayTasksByUserId);
router.get('/task/:id', authMiddleware, getTaskById);
router.put('/task/:id', authMiddleware, updateTask);
router.put('/task/:id/progress', authMiddleware, updateProgress);
router.delete('/task/:id', authMiddleware, deleteTask);

module.exports = router;