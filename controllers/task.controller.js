const { Task } = require('../models');
const { Op } = require('sequelize')

exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, status } = req.body;

        const task = await Task.create({
            title,
            description: description || null,
            dueDate: dueDate || null,
            status,
            UserId: req.user.id,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error("Error al crear la tarea:", error);
        res.status(500).json({ message: "Error al crear la tarea" });
    }
};


exports.getTasksByUserId = async (req, res) => {
    const userId = req.user.id;
    const { status, query, startDate, endDate } = req.query;

    try {
        const whereClause = { UserId: userId };

        if (status) {
            whereClause.status = status;
        }

        if (query) {
            whereClause[Op.and] = [
                ...(whereClause[Op.and] || []),
                {
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${query}%` } },
                        { description: { [Op.iLike]: `%${query}%` } }
                    ]
                }
            ];
        }

        if (startDate || endDate) {
            const dateFilter = {};
            if (startDate) dateFilter[Op.gte] = new Date(startDate);
            if (endDate) dateFilter[Op.lte] = new Date(endDate);

            whereClause[Op.and] = [
                ...(whereClause[Op.and] || []),
                { dueDate: dateFilter }
            ];
        }

        const tasks = await Task.findAll({ where: whereClause });
        res.json(tasks);
    } catch (error) {
        console.error("Error al obtener tareas:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.getTaskById = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
}

exports.getTodayTasksByUserId = async (req, res) => {
    const userId = req.user.id;
    const { status, query } = req.query;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const whereClause = {
            UserId: userId,
            dueDate: {
                [Op.between]: [startOfDay, endOfDay]
            }
        };

        if (status) {
            whereClause.status = status;
        }

        if (query) {
            whereClause[Op.and] = [
                ...(whereClause[Op.and] || []),
                {
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${query}%` } },
                        { description: { [Op.iLike]: `%${query}%` } }
                    ]
                }
            ];
        }

        const tasks = await Task.findAll({ where: whereClause });
        res.json(tasks);
    } catch (error) {
        console.error("Error al obtener tareas de hoy:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    await task.update(req.body);
    res.json(task);
}

exports.updateProgress = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        let newStatus;

        switch (task.status) {
            case "pending":
                newStatus = "in-progress";
                break;
            case "in-progress":
                newStatus = "done";
                break;
            case "done":
                return res.status(400).json({ message: 'La tarea ya está completada. No se puede avanzar más.' });
            default:
                return res.status(400).json({ message: `Estado inválido: ${task.status}` });
        }

        task.status = newStatus;
        await task.save();

        return res.status(200).json({ message: 'Estado actualizado con éxito', task });
    } catch (error) {
        console.error("Error al actualizar el progreso de la tarea:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    await task.destroy();
    res.status(204).send();
}

