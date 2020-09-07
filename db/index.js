const mongoose = require('mongoose')
const { URL_DB } = require('../config')

const connectDB = () => mongoose.connect(URL_DB, { useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

module.exports = connectDB;