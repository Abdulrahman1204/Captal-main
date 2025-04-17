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
router.route("/").post(createOrderFinance).get(verifyToken, verifyRoles("admin"), getAllOrderFinance);

// /api/captal/orderFinance/:id
router
  .route("/:id")
  .put(verifyToken, verifyRoles("admin"), updateOrderFinance)
  .delete(verifyToken, verifyRoles("admin"), deleteOrderFinance)
  .get(verifyToken, verifyRoles("admin"), getOrderFinanceById);

// /api/captal/orderFinance/status/:id
router.route("/status/:id").patch(verifyToken, verifyRoles("admin"), updateStatus);

// /api/captal/orderFinance/:userId
router.route('/contractor/:id').get(verifyToken, verifyRoles("contractor"), getOrdersForContractor)
module.exports = router;
