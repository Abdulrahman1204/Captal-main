const express = require("express");
const router = express.Router();
const { verifyRoles, verifyToken } = require("../middlewares/verifyToken");
const { createMaterialOrder,deleteMatrialOrder,getAllMaterialsOrder,getMaterialOrderByID,updateMaterialOrder } = require('../controllers/martrialController')

// api/captal/material
router.route("/").get(getAllMaterialsOrder).post(verifyToken, verifyRoles("admin"), createMaterialOrder)
// api/captal/material/:id
router.route("/:id").get(verifyToken, verifyRoles("admin"),getMaterialOrderByID).put(verifyToken, verifyRoles("admin"),updateMaterialOrder).delete(verifyToken, verifyRoles("admin"),deleteMatrialOrder)

module.exports = router
