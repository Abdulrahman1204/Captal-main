const express = require("express");
const router = express.Router();
const { verifyRoles, verifyToken} = require("../middlewares/verifyToken");
const {createOrderMaterial,deleteOrderMaterial,getAllOrderMaterials,getOrderMaterialById,updateOrderMaterial,updateStatus, getOrdersForContractor } = require("../controllers/orderMaterialController")

router.route("/").post(createOrderMaterial).get(verifyToken, verifyRoles("admin"), getAllOrderMaterials)

// /api/captal/orderMaterial/:id
router.route("/:id").put(verifyToken, verifyRoles("admin"), updateOrderMaterial).delete( verifyToken, verifyRoles("admin"), deleteOrderMaterial).get( verifyToken, verifyRoles("admin"), getOrderMaterialById); 

// /api/captal/orderMaterial/status/:id
router.route("/status/:id").patch( verifyToken, verifyRoles("admin"), updateStatus)

// /api/captal/orderMaterial/contractor/:userId
router.route('/contractor/:id').get(verifyToken, verifyRoles("contractor"), getOrdersForContractor)
module.exports = router
