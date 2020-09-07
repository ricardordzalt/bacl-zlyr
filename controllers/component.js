const Component = require('../models/component');
const Design = require('../models/design');
const User = require('../models/user');

const getDesignComponents = (req, res) => {
    const { designId } = req.params;
    Design.findById(designId)
        .populate('components')
        .exec((err, designDB) => {
            if (err) {
                return res.status(400).send({ ok: false, err });
            };
            res.send({ ok: true, components: designDB.components });
        });
};

const getOneComponent = (req, res) => {
    const { id } = req.params;
    Component.findById(id, (err, component) => {
        if (err) {
            return res.status(400).send({ ok: false, err });
        };
        res.send({ ok: true, component });
    });
};

const addComponent = (req, res) => {
    const { level, name, parentId, designId } = req.body;
    Design.findById(designId, (err, design) => {
        if (err) {
            return res.status(400).send({ ok: false, err });
        };
        if (!!parentId) {
            Component.findById(parentId, (err, parentComponent) => {
                if (err) {
                    return res.status(400).send({ ok: false, err });
                };
                const newComponent = new Component({ level, name, design: design._id, parent: parentComponent._id });
                newComponent.save((err, newComponentDB) => {
                    if (err) {
                        return res.status(400).send({ ok: false, err });
                    };
                    parentComponent.childs = [...parentComponent.childs, newComponentDB];
                    parentComponent.save((err, parentComponentDB) => {
                        if (err) {
                            return res.status(400).send({ ok: false, err });
                        };
                        design.components = [...design.components, newComponentDB];
                        design.save((err, savedDesign) => {
                            if (err) {
                                return res.status(400).send({ ok: false, err });
                            };
                            res.send({ ok: true, message: 'Componente agregado' });
                        });
                    });
                });
            });
        } else {
            const newComponent = new Component({ level, name, design: design._id });
            newComponent.save((err, newComponentDB) => {
                if (err) {
                    return res.status(400).send({ ok: false, err });
                };
                design.components = [...design.components, newComponentDB];
                design.save((err, savedDesign) => {
                    if (err) {
                        return res.status(400).send({ ok: false, err });
                    };
                    res.send({ ok: true, message: 'Componente agregado' });
                });
            });
        }
    });
};

const deleteComponent = (req, res) => {
    const { id } = req.params;
    Component.findByIdAndRemove(id, (err, component) => {
        console.log('component', component);
        if (err) {
            return res.status(400).send({ ok: false, err });
        };
        if(!!component.parent){
            Component.findById(component.parent, (err, parentComponent) => {
                parentComponent.childs = parentComponent.childs.filter(child => child._id != id);
                parentComponent.save((err, savedParentComponent) => {
                    if(err) {
                        return res.status(400).send({ ok: false, err });
                    };
                });
            });
        };
        const designId = component.design;
        Design.findById(designId, (err, design) => {
            console.log('design', design);
            if(err) {
                return res.status(400).send({ ok: false, err });
            };
            design.components = design.components.filter(component => component._id != id);
            design.save((err, savedDesign) => {
                if(err) {
                    return res.status(400).send({ ok: false, err });
                };
                res.send({ ok: true, message: 'Componente elminado' });
            });
        });
    });
};

module.exports = {
    getDesignComponents,
    getOneComponent,
    addComponent,
    deleteComponent
};