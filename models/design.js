const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const designSchema = new Schema({
    components: [{
        type:Schema.Types.ObjectId,
        ref: 'Component'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Design', designSchema);