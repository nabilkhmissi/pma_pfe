const { ObjectId } = require("mongodb");
const Reclamation = require("../models/reclamations");
const Project = require("../models/project");
const User = require("../models/user");
const reclamations = require("../models/reclamations");


/* addReclamation help us to create reclamations */
module.exports.AddReclamation = async function (req, res) {
    const body = { ...req.body };

    const generatedNumbers = new Set();
    do {
        code = Math.floor(1000 + Math.random() * 9000);
    } while (generatedNumbers.has(code));
    generatedNumbers.add(code);

    try {
        const client = await User.findById({ _id: body.client });
        //console.log(client);

        if (!client) {
            return res.status(400).send({ message: "Invalid User :Client " });
        }
        const project = await Project.findById({ _id: body.project._id });
        //console.log(project);
        if (!project) {
            return res.status(400).send({ message: "Invalid Project " });
        }
        let reclamation = new Reclamation({
            Title: body.Title,
            CodeRec: "RC" + code,
            Comment: body.Comment,
            Type_Reclamation: body.Type_Reclamation,
            Addeddate: body.Addeddate,
            client: client._id,
            project: project,
            status: body.status
        });
        reclamation = await reclamation.save();
        res.send(reclamation);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

/*  getAllReclamations will return all reclamation in the data base*/
module.exports.getAllReclamations = async function (req, res) {
    Reclamation.find()
        .populate("project")
        .populate("client", "-password")
        .then((reclamations) => {
            res.status(200).json(reclamations)
        })
        .catch((error) => res.status(404).json({ message: error }))
}

/* GetAllReclamationsIntreatment return all reclamation "In Treatment" state */
module.exports.getAllReclamationsInTraetement = async function (req, res) {
    Reclamation.find({ status: "In treatment" }).then((reclamations) => {
        res.status(200).json(reclamations);
    });
};

/* getAllReclamationsPending return all reclamation in "Pending" state */
module.exports.getAllReclamationsPending = async function (req, res) {
    Reclamation.find({ status: 'Pending' })
        .populate("project")
        .populate("client", "-password")
        .then((reclamations) => {
            res.status(200).json(reclamations)
        })
        .catch((error) => res.status(404).json({ message: error }))
}

/* getAllReclamationstreated return all reclamation in "Treated" state */
module.exports.getAllReclamationstreated = async function (req, res) {
    Reclamation.find({ status: "Treated" }).then((reclamations) => {
        res.status(200).json(reclamations);
    });
};

/* deleteReclamation will delete a specific reclamation */
module.exports.deleteReclamation = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is not valid" });
    }
    try {
        const reclamation = await Reclamation.findByIdAndRemove({ _id: ID });
        if (reclamation) {
            res.status(200).json({ message: "Reclamation deleted succefully" })
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

/* UpdateReclamationStatus will update  a specific reclamation status */
module.exports.UpdateReclamationStatus = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is not valid" });
    }
    Reclamation.findByIdAndUpdate(ID, { $set: { status: req.body.status } }).then(() => {
        res.status(200).json({ message: " project status updated" });
    })
        .catch((error) => { res.status(500).json({ message: error }) })

}

/* UpdateReclamationStatus will update  a specific reclamation  */
module.exports.UpdateReclamation = async function (req, res) {
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is not valid" });
    }
    const body = { ...req.body };
    Reclamation.findByIdAndUpdate(ID, { $set: body }).then(() => {
        return res.status(201).json({ message: "Reclamation updated" })
    })
        .catch((error) => {
            return res.status(500).json({ message: error })
        })
};

/* getAllReclamationstechnical will return all technical reclamation  */
module.exports.getAllReclamationstechnical = async function (req, res) {
    Reclamation.find({ Type_Reclamation: "Technical" }).then((reclamations) => {
        res.status(200).json(reclamations);
    });
};

/* getAllReclamationsCommercial will return all Commercial reclamation  */
module.exports.getAllReclamationsCommercial = async function (req, res) {
    Reclamation.find({ Type_Reclamation: "Commercial" }).then((reclamations) => {
        res.status(200).json(reclamations);
    });
};
module.exports.getReclamationsByProject = async function (req, res) {
    const p = req.params.id
    const project = await Project.findById({ _id: p })
    Reclamation.find({ project: project._id }).populate("project").populate("client", "-password")
        .then((reclamations) => {
            res.status(200).json(reclamations);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
}
module.exports.getReclamationsByclient = async function (req, res) {
    const c = req.params.id
    const client = await User.findById({ _id: c })
    Reclamation.find({ client: client._id }).populate("project").populate("client", "-password")
        .then((reclamations) => {
            res.status(200).json(reclamations);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
}
module.exports.getReclamsForProduct = async function (req, res) {
    try {
        const leader = req.params.id;
        const _teamleader = await User.findById(leader);

        const matchingProjects = await Project.find({ TeamLeader: _teamleader._id });

        const projectIds = matchingProjects.map(project => project._id);
        const claims = await Reclamation.find({ project: { $in: projectIds } })
            .populate("project")
            .populate("client", "-password");

        res.status(200).json(claims);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}