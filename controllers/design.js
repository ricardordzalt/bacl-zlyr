const Design = require('../models/design');
const User = require('../models/user');

const getDesigns = (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Design.find()
        .skip(from).limit(limit).exec((err, designs) => {
            if (err) {
                return res.status(400).send({ ok: false, err });
            };
            Design.countDocuments((err, count) => {
                if (err) {
                    return res.status(400).send({ ok: false, err });
                };
                res.send({ ok: true, designs, count });
            });
        });
};

const getUserDesigns = (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
        .populate('designs')
        .exec((err, userDB) => {
            if(err) {
                return res.status(400).send({ ok: false, err });
            };
            res.send({ ok: true, designs: userDB.designs });
        });
};

const getOneDesign = (req, res) => {
    const { id } = req.params;
    Design.findById(id, (err, design) => {
        if(err) {
            return res.status(400).send({ ok: false, err });
        };
        res.send({ ok: true, design });
    });
};

const addDesign = (req, res) => {
    const { id } = req.params;
    User.findById(id, (err, userDB) => {
        if(err) {
            return res.status(400).send({ ok: false, err });
        };
        const design = new Design({ user: id });
        design.save((err, newDesign) => {
            if(err) {
                return res.status(400).send({ ok: false, err });
            };
            userDB.designs = [...userDB.designs, newDesign];
            userDB.save((err, userSaved) => {
                if(err) {
                    return res.status(400).send({ ok: false, err });
                };
                res.send({ ok: true, design: newDesign, message: 'Nuevo diseño agregado' });
            });
        });
    });
};

const deleteDesign = (req, res) => {
    const { id } = req.params;
    Design.findByIdAndRemove(id, (err, design) => {
        if(err) {
            return res.status(400).send({ ok: false, err });
        };
        const userId = design._id;
        User.findById(userId, (err, userDB) => {
            if(err) {
                return res.status(400).send({ ok: false, err });
            };
            userDB.designs = userDB.designs.filter(design => design._id != id );
            userDB.save((err, userSaved) => {
                if(err) {
                    return res.status(400).send({ ok: false, err });
                };
                res.send({ ok: true, message: 'Diseño borrado' });
            })
        });
    });
};

module.exports = { getDesigns, getUserDesigns, getOneDesign, addDesign, deleteDesign };