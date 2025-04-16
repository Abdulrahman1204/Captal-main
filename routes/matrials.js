const express = require("express");
const router = express.Router();
const { verifyToken,verifyUser , verifyAuthorization, verifyAdmin } = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');
const {createMaterialOrder,deleteMatrialOrder,getAllMaterialsOrder,getMaterialOrderByID,updateMaterialOrder,updateStatus} = require('../controllers/martrialController')

// api/captal/material
router.route("/").get(getAllMaterialsOrder).post(verifyAdmin, createMaterialOrder)
// api/captal/material/:id
router.route("/:id").get(verifyAdmin,getMaterialOrderByID).put(verifyAdmin,updateMaterialOrder).delete(verifyAdmin,deleteMatrialOrder)

module.exports = router

