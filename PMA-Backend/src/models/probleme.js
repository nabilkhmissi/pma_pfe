const mongoose = require("mongoose");

const ProblemeSchema = mongoose.Schema({
    title: { type: String, required: true },
    action: { type: String, },
    impact: { type: String },
    details: { type: String },
    date: { type: Date },
    project: { type: mongoose.Types.ObjectId, ref: "Project" },
    user: { type: mongoose.Types.ObjectId, ref: "User" }
});
module.exports = mongoose.model("Probleme", ProblemeSchema);