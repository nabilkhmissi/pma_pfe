const express = require("express");
const router = express.Router();
const probCtr = require("../controllers/problemeController")
const { authMiddleware } = require("../middlewares/authMiddleware");



router.get("/getAllProblemes", probCtr.getAllProblemes);
router.get("/getProbyUSer/:id", probCtr.getProbyUSer);
router.get("/getProbyProj/:id", probCtr.getProbyProj);

router.post("/createProb", probCtr.createProb);
router.delete("/deleteProbleme/:id", probCtr.deleteProbleme)
router.patch("/updateProbleme/:id", probCtr.updateProbleme)

module.exports = router;