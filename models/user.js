const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'El nombre de usuario es necesario'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    fatherSurname: {
        type: String,
        default: ''
    },
    motherSurname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    status: {
        type: Boolean,
        default: true
    },
    designs: [{
        type: Schema.Types.ObjectId,
        ref: 'Design',
        default: []
    }],
});

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único'});

module.exports = mongoose.model('User', userSchema);