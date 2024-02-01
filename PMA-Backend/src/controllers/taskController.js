const { ObjectId } = require("mongodb");
const Task = require("../models/task");
const Project = require("../models/project");
const User = require("../models/user");

//getALLTasks will retur all the tasks in my database
module.exports.getAllTasks = async function (req, res) {
    try {

        const taskStatus = req.query.status;
        var tasks;
        if (taskStatus) {
            tasks = await Task.find({ Status: taskStatus }).populate("Project").populate("Executor", "-password")
        } else {
            tasks = await Task.find({}).populate("Project").populate("Executor", "-password")
        }
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};


/* getAllClosedTasks will return all closed tasks (Done) */
module.exports.getAllClosedTasks = async function (req, res) {
    Task.find({ Status: "Closed" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


/*GetAllOpenTasks will return all open tasks */
module.exports.getAllOpenTasks = async function (req, res) {
    Task.find({ Status: "Open" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


/* getAllHighTasks will tasks with High priority  */
module.exports.getAllHighTasks = async function (req, res) {
    Task.find({ Priority: "High" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


/* getAllHighTasks will tasks with Meduim priority  */
module.exports.getAllMeduimTasks = async function (req, res) {
    Task.find({ Priority: "Meduim" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


/* getAllHighTasks will tasks with Low priority  */
module.exports.getAllLowTasks = async function (req, res) {
    Task.find({ Priority: "Low" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


//getAllBugTasks will return all tasks that there type is "Bug"
module.exports.getAllBugTasks = async function (req, res) {
    Task.find({ Type: "Bug" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


//getAllBugTasks will return all tasks that there type is "Error"
module.exports.getAllErrorTasks = async function (req, res) {
    Task.find({ Type: "Error" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};

//getAllBugTasks will return all tasks that there type is "Development"
module.exports.getAllDevTasks = async function (req, res) {
    Task.find({ Type: "Development" }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
};


// createTask will create a task
module.exports.CreateTask = async function (req, res) {
    const body = { ...req.body };
    try {
        //here we check if the project exist or not
        const project = await Project.findById({ _id: body.Project._id });
        //console.log(project);
        if (!project) {
            return res.status(400).send({ message: "Invalid Project " });
        }

        //here we check if the Employee exist or not
        var employees = [];
        var eq = [];
        var employee
        var employeeID = []
        employees = body.Executor;
        for (i = 0; i < employees.length; i++) {
            employee = await User.findById({ _id: employees[i]._id });
            employeeID.push(employee._id)
            if (!employee) {
                return res.status(400).send({ message: "Invalid User :employee " });
            }
            eq.push(employee);
        }
        let task = new Task({
            Title: body.Title,
            Project: project,
            Details: body.Details,

            StartDate: body.StartDate,
            Executor: employeeID,
            Deadline: body.Deadline,
            Priority: body.Priority,
        });
        task = await task.save();
        res.send(task);
    } catch (error) {
        return res.status(500).json({ error });
    }
};


// deleteTask will delete a specific task
module.exports.deleteTask = async function (req, res) {
    //here we recovery the id from the request and we verify that this id is Valid
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is Not valid" });
    }
    try {
        const task = await Task.findByIdAndRemove({ _id: ID });
        if (task) {
            res.status(200).json({ message: "Task deleted successfully" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};


//updateTask will update a specific Task
module.exports.updateTask = async function (req, res) {
    //here we recovery the id from the request and we verify that this id is Valid
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is Not valid" });
    }
    //const body = {...req.body };
    const task = Task.findByIdAndUpdate(ID, {
        Title: req.body.Title,
        Project: req.body.Project,
        Details: req.body.Details,
        Status: req.body.Status, //open or closed status
        StartDate: req.body.StartDate,
        Deadline: req.body.Deadline,
        Executor: req.body.Executor,
        progress: req.body.progress,
        // Type: req.body.Type,
        Priority: req.body.Priority
    }, { new: true })
        .then(() => {
            console.log(ID)

            return res
                .status(200)
                .json({ message: "task Updated succcessfully ! ", task });
        })
        .catch((error) => {
            return res.status(500).json({ message: error });
        });
};


//updateTasksStatus will update the status of the tasks
module.exports.updateTaskStatus = async function (req, res) {
    //here we recovery the id from the request and we verify that this id is Valid

    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json({ message: "ID is not valid" });
    }
    const body = { ...req.body };
    Task.findByIdAndUpdate(ID, { $set: { Status: body.Status } }, { new: true })
        .then(() => {
            // console.log("done");
            return res
                .status(201)
                .json({ message: "Task's status updated successfully" });
        })
        .catch((error) => {
            return res.status(500).json({ message: error });
        });
};


//getTaskbyId will return a task specific task
module.exports.getTaskById = async function (req, res) {
    //here we recovery the id from the request and we verify that this id is Valid
    const ID = req.params.id;
    if (!ObjectId.isValid(ID)) {
        return res.status(404).json("ID is not valid");
    }
    try {
        const task = await Task.findById(ID).populate("Project").populate("Executor", "-password");
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
module.exports.getTaskByProjectID = async function (req, res) {
    try {
        const p = req.params.id;
        const { status, date } = req.query;
        var tasks;
        const project = await Project.findById({ _id: p });
        //if status == undefined means that the user requested tasks from dashboard page
        if (req.query.status == undefined) {
            tasks = await Task.find({ Project: project._id }).sort({ StartDate: +date }).populate("Project").populate("Executor", "-password");
        } else if (status != 'null') {
            tasks = await Task.find({ Project: project._id, Status: status }).sort({ StartDate: +date }).populate("Project").populate("Executor", "-password");
        } else {
            tasks = await Task.find({ Project: project._id }).sort({ StartDate: date }).populate("Project").populate("Executor", "-password");
        }
        return res.status(200).json(tasks);
    } catch (error) {
        res.status(404).json({ message: error });
    }
};
module.exports.getTaskByExecutor = async function (req, res) {
    const e = req.params.id
    const executor = await User.findById({ _id: e })
    Task.find({ Executor: executor._id }).populate("Project").populate("Executor", "-password")
        .then((Tasks) => {
            res.status(200).json(Tasks);
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
}
module.exports.gettskks = async function (req, res) {
    try {
        const leader = req.params.id;
        const _teamleader = await User.findById(leader);

        const matchingProjects = await Project.find({ TeamLeader: _teamleader._id });

        const projectIds = matchingProjects.map(project => project._id);
        const tasks = await Task.find({ Project: { $in: projectIds } })
            .populate("Project")
            .populate("Executor", "-password");

        res.status(200).json(tasks);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};