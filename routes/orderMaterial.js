const express = require("express");
const router = express.Router();
const { verifyToken,  verifyAdmin, verifyContractor} = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');
const {createOrderMaterial,deleteOrderMaterial,getAllOrderMaterials,getOrderMaterialById,updateOrderMaterial,updateStatus, getOrdersForContractor } = require("../controllers/orderMaterialController")

router.route("/").post(createOrderMaterial).get(verifyAdmin, getAllOrderMaterials)

// /api/captal/orderMaterial/:id
router.route("/:id").put(verifyAdmin, updateOrderMaterial).delete( verifyAdmin, deleteOrderMaterial).get( validId, getOrderMaterialById); 

// /api/captal/orderMaterial/status/:id
router.route("/status/:id").patch( verifyAdmin, updateStatus)

// /api/captal/orderMaterial/contractor/:userId
router.route('/contractor/:id').get(verifyContractor, getOrdersForContractor)
module.exports = router
