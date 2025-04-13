const express = require("express");
const router = express.Router();
const { verifyToken,verifyUser} = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');
const {getAllOrderFinance,createOrderFinance,deleteOrderFinance,getOrderFinanceById,updateOrderFinance,updateStatus} = require("../controllers/orderFinanceController")
// /api/captal/orderFinance
router.route("/").post(createOrderFinance).get(getAllOrderFinance)

// /api/captal/orderFinance/:id
router.route("/:id").put(validId, updateOrderFinance).delete(validId, deleteOrderFinance).get(validId, getOrderFinanceById); 

// /api/captal/orderFinance/status/:id
router.route("/status/:id").patch( validId, updateStatus)

// /api/captal/orderFinance/:userId


module.exports = router