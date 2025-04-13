const express = require("express");
const router = express.Router();
const { verifyToken,verifyUser , verifyAuthorization } = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');
const {createMaterialOrder,deleteMatrialOrder,getAllMaterialsOrder,getMaterialOrderByID,updateMaterialOrder,updateStatus} = require('../controllers/martrialController')

// api/captal/material
router.route("/").get(getAllMaterialsOrder).post(createMaterialOrder)
// api/captal/material/:id
router.route("/:id").get(validId,getMaterialOrderByID).put(validId,updateMaterialOrder).delete(validId,deleteMatrialOrder)

module.exports = router
