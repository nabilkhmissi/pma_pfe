const express = require("express");
const router = express.Router();
const procesvCtrl = require("../controllers/procesController");
const { fileStorageEngine } = require('../tools/FileStorageEngine')

const { authMiddleware } = require("../middlewares/authMiddleware");
const { checkTeamLeaderMiddleware } = require("../middlewares/checkTeamLeaderMiddleware");
const multer = require("multer");
const { checkAdminMiddleware } = require("../middlewares/checkAdminMiddleware");
const upload = multer({ storage: fileStorageEngine });



router.get('/getAllProcesV', authMiddleware, procesvCtrl.getAllProcesV);
router.get('/getProcesById/:id', authMiddleware, procesvCtrl.getProcesById)
router.post('/addProcesV', procesvCtrl.addProcesV);
router.put('/updateProcesv/:id', authMiddleware, procesvCtrl.updateProcesv);
router.delete('/deleteProcesV/:id', authMiddleware, checkAdminMiddleware, procesvCtrl.deleteProcesV)
router.get('/getProcesByUser/:id', procesvCtrl.getProcesByUser)
router.get('/getProcesByProject/:id', procesvCtrl.getProcesByProject)

module.exports = router;