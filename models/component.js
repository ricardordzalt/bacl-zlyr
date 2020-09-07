const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const componentSchema = new Schema({
    level: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'Component'
    },
    childs: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Component'
    }],
    design: {
        type: mongoose.Schema.ObjectId,
        ref: 'Design'
    }
});

module.exports = mongoose.model('Component', componentSchema);