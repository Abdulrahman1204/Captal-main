const express = require("express");
const router = express.Router();
const { verifyToken,verifyUser , verifyAdmin, verifyRoles } = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');
const {createMaterialOrder,deleteMatrialOrder,getAllMaterialsOrder,getMaterialOrderByID,updateMaterialOrder,uploadExcel} = require('../controllers/martrialController')

// api/captal/material
router.route("/").get(getAllMaterialsOrder).post(verifyToken, verifyRoles("admin"), createMaterialOrder)
// api/captal/material/:id
router.route("/:id").get(verifyToken, verifyRoles("admin"),getMaterialOrderByID).delete(verifyToken, verifyRoles("admin"),deleteMatrialOrder)
// api/captal/material/upload-excel
router.route("/upload-excel").post(verifyToken, verifyRoles("admin"), uploadExcel)
module.exports = router

