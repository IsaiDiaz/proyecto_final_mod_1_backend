var express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
var path = require('path');
require('dotenv').config();

var usersRouter = require('./routes/user.routes');
var tasksRouter = require('./routes/task.routes');

const PORT = process.env.PORT || 3000;

var app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

app.use('/api', usersRouter);
app.use('/api', tasksRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);

