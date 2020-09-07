const express = require('express');
const app = express();
const userRoutes = require('./user');
const designRoutes = require('./design');
const componentRoutes = require('./component');

app.use('/user', userRoutes);
app.use('/design', designRoutes);
app.use('/component', componentRoutes);

module.exports = app;