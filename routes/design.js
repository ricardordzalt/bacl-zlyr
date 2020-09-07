const express = require('express');
const app = express();
const designController = require('../controllers/design');
const { verifyToken } = require('../middlewares/authentication');

app.get('/', verifyToken, designController.getDesigns);
app.get('/user/:userId', verifyToken, designController.getUserDesigns);
app.get('/:id', verifyToken, designController.getOneDesign);
app.post('/:id', verifyToken, designController.addDesign);
app.delete('/:id', verifyToken, designController.deleteDesign);

module.exports = app;