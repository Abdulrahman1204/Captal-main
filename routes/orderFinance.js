const express = require("express");
const router = express.Router();
const { verifyToken ,verifyAdmin,verifyRoles, verifyContractor} = require("../middlewares/verifyToken");

const validId = require("../middlewares/validateId");
const {
  getAllOrderFinance,
  createOrderFinance,
  deleteOrderFinance,
  getOrderFinanceById,
  updateOrderFinance,
  updateStatus,
  getOrdersForContractor,
} = require("../controllers/orderFinanceController");
// /api/captal/orderFinance
router.route("/").post(createOrderFinance).get(verifyAdmin, getAllOrderFinance);

// /api/captal/orderFinance/:id
router
  .route("/:id")
  .put(verifyAdmin, updateOrderFinance)
  .delete(verifyAdmin, deleteOrderFinance)
  .get(verifyAdmin, getOrderFinanceById);

// /api/captal/orderFinance/status/:id
router.route("/status/:id").patch(verifyAdmin, updateStatus);

// /api/captal/orderFinance/:userId
router.route('/contractor/:id').get(verifyContractor, getOrdersForContractor)
module.exports = router;
