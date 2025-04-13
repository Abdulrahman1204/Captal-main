const express = require("express");
const {createOrderQualification,deleteOrderQualification,getAllOrderQualifications, getOrderQualificationById, updateOrderQualification, updateStatus} = require("../controllers/orderQualificationController");
const { verifyToken,verifyUser} = require("../middlewares/verifyToken");
const router = express.Router();
const validId = require('../middlewares/validateId');


// api/captal/orderQualification
router.route("/").post(createOrderQualification).get(getAllOrderQualifications);

// /api/captal/orderQualification/:id
router.route("/:id").put(validId, updateOrderQualification).delete(validId, deleteOrderQualification).get(validId, getOrderQualificationById); 

// /api/captal/orderQualification/status/:id
router.route("/status/:id").patch( validId, updateStatus)



module.exports = router