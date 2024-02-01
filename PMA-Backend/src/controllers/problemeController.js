const { ObjectId } = require("mongodb");
const Project = require("../models/project");
const User = require("../models/user")
const Probleme = require("../models/probleme")


module.exports.getAllProblemes = async function(req, res) {
    Probleme.find().populate("user", "-password").populate("project")

    .then((problems) => {
            res.status(200).json(problems);
        })
        .catch((error) => res.status(404).json({ message: error }));
};

module.exports.deleteProbleme = async function(req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is Not valid" });
    }
    try {
        const _prob = await Probleme.findByIdAndRemove({ _id: ID });
        if (_prob) {
            res.status(200).json({ message: "problem deleted successfully" })
        }
    } catch (error) {
        res.status(500).json(error);
    }
}
module.exports.updateProbleme = async function(req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is Not valid" });
    }
    const body = {...req.body };
    Probleme.findOneAndUpdate(ID, { $set: body }).then(() => {
            return res.status(201).json({ message: "probleme Updated succcessfully ! " })
        })
        .catch((error) => { return res.status(500).json({ message: error }) })
}

module.exports.createProb = async function(req, res) {
    const body = {...req.body };
    const _p = await Project.findById({ _id: body.project._id })
    const _u = await User.findById({ _id: body.user })
    try {
        let probleme = new Probleme({
            title: body.title,
            action: body.action, //resolved,Pending
            impact: body.impact,
            details: body.details,
            date: body.date,
            project: _p,
            user: _u

        });
        probleme = await probleme.save();
        res.send(probleme);
    } catch (error) {
        res.status(500).json(error)
    }
}
module.exports.getProbyUSer = async function(req, res) {
    const u = req.params.id;
    const _user = await User.findById({ _id: u })

    Probleme.find({ user: _user._id }).populate("user", "-password").populate("project")
        .then((probs) => { res.status(200).json(probs) })
        .catch((error) => {
            res.status(500).json(error)
        })
}

module.exports.getProbyProj = async function(req, res) {
    const u = req.params.id;
    const _project = await Project.findById({ _id: u })

    Probleme.find({ project: _project._id }).populate("user", "-password").populate("project")
        .then((probs) => { res.status(200).json(probs) })
        .catch((error) => {
            res.status(500).json(error)
        })
}