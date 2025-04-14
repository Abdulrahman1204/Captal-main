const express = require("express");
const {createOrderQualification,deleteOrderQualification,getAllOrderQualifications, getOrderQualificationById, updateOrderQualification, updateStatus} = require("../controllers/orderQualificationController");
const { verifyToken, verifyRoles } = require("../middlewares/verifyToken");
const router = express.Router();


// api/captal/orderQualification
router.route("/").post(createOrderQualification).get(verifyToken, verifyRoles("admin"), getAllOrderQualifications);

// /api/captal/orderQualification/:id
router.route("/:id").put(verifyToken, verifyRoles("admin"), updateOrderQualification).delete(verifyToken, verifyRoles("admin"), deleteOrderQualification).get(verifyToken, verifyRoles("admin"), getOrderQualificationById); 

// /api/captal/orderQualification/status/:id
router.route("/status/:id").patch( verifyToken, verifyRoles("admin"), updateStatus)



module.exports = router