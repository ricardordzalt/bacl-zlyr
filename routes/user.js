const express = require('express');
const app = express();
const userController = require('../controllers/user');
const { verifyToken } = require('../middlewares/authentication');

app.get('/', verifyToken, userController.getUsers);
app.post('/', userController.addUser);
app.put('/:id', verifyToken, userController.updateUser);
app.delete('/:id', verifyToken, userController.deleteUser);
app.post('/login', userController.loginUser);

module.exports = app;