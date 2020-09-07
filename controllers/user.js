const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { JWT_SEED, TOKEN_EXPIRATION } = require('../config');
const jwt = require('jsonwebtoken');

const getUsers = (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    const activeUsers = { status: true };
    User.find(activeUsers)
        .skip(from).limit(limit).exec((err, users) => {
            if(err) {
                return res.status(400).send({ ok: false, err });
            };
            User.countDocuments(activeUsers, (err, count) => {
                if(err) {
                    return res.status(400).send({ ok: false, err });
                };

                res.send({ ok: true, users, count });
            });
        });
};

const addUser = (req, res) => {
    let { userName, name, fatherSurname, motherSurname, email, password } = req.body;
    password = bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if(hashErr) {
            return res.status(400).send({ ok: false, err: hashErr });
        };
        let user = new User({
            userName, name, fatherSurname, motherSurname, email, password: hashedPassword
        });
        user.save((err, userDB) => {
            if(err) {
                return res.status(400).send({ ok: false, err });
            };
            res.send({ ok: true, user: userDB });
        });
    });
};

const updateUser = (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['userName', 'name', 'fatherSurname', 'motherSurname', 'email', 'status']);
    const options = { new: true, runValidators: true };
    User.findByIdAndUpdate(id, body, options, (err, userDB) => {
        if(err) {
            return res.status(400).send({ ok: false, err });
        };
        res.send({ ok: true, user: userDB });
    });
};

const deleteUser = (req, res) => {
    const { id }  = req.params;
    const newStatus = { status: false };
    User.findByIdAndUpdate(id, newStatus, (err, deletedUser) => {
        if(err){
            return res.status(400).send({ ok: false, err });
        };
        if(!deletedUser) {
            return res.status(400).send({ ok: false, err: { message: 'Usuario no encontrao' } });
        };
        res.send({ ok: true, user: deletedUser });
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, userDB) => {
        if(err) {
            return res.status(400).send({ ok: false, err });
        };
        if(!userDB) {
            return res.status(401).send({ ok: false, err: { message: 'Usuario o contraseña incorrectos'} });
        };

        bcrypt.compare(password, userDB.password, (hashErr, didMatch) => {
            if(hashErr) {
                return res.status(400).send({ ok: false, err: hashErr });
            };
            if(didMatch) {
                const token = jwt.sign({ user: userDB }, JWT_SEED, { expiresIn: TOKEN_EXPIRATION });
                res.send({ ok: true, user: userDB, token });
            }else {
                return res.status(401).send({ ok: false, err: { message: 'Usuario o contraseña incorrectos'} });
            };
        });
    });
};

module.exports = { getUsers, addUser, updateUser, deleteUser, loginUser };