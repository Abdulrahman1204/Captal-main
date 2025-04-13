const express = require("express");
const router = express.Router();
const { verifyToken,  verifyAdmin} = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');
const {createOrderMaterial,deleteOrderMaterial,getAllOrderMaterials,getOrderMaterialById,updateOrderMaterial,updateStatus } = require("../controllers/orderMaterialController")

router.route("/").post(createOrderMaterial).get(verifyAdmin, getAllOrderMaterials)

// /api/captal/orderMaterial/:id
router.route("/:id").put( validId, updateOrderMaterial).delete( validId, deleteOrderMaterial).get( validId, getOrderMaterialById); 

// /api/captal/orderMaterial/status/:id
router.route("/status/:id").patch(  validId, updateStatus)


module.exports = router
