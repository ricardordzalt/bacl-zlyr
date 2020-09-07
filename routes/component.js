const express = require('express');
const app = express();
const componentController = require('../controllers/component');
const { verifyToken } = require('../middlewares/authentication');

app.get('/design/:designId', verifyToken, componentController.getDesignComponents);
app.get('/:id', verifyToken, componentController.getOneComponent);
app.post('/', verifyToken, componentController.addComponent);
app.delete('/:id', verifyToken, componentController.deleteComponent);

module.exports = app;