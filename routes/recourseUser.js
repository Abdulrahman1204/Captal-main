const express = require("express");
const router = express.Router();
const {
  createRecourseUserOrder,
  getAllRecourseUserOrders,
  getRecourseUserOrderById,
  updateRecourseUserOrder,
  updateOrderStatus,
  deleteRecourseUserOrder
} = require("../controllers/recourseUserController");
const { verifyToken ,verifyAdmin,verifyRoles} = require("../middlewares/verifyToken");

router.route("/")
  .post(verifyAdmin, createRecourseUserOrder)
  .get(verifyToken,verifyRoles("recourse"), getAllRecourseUserOrders);

router.route("/:id")
  .get(verifyAdmin, getRecourseUserOrderById)
  .put(verifyAdmin, updateRecourseUserOrder)
  .delete(verifyAdmin, deleteRecourseUserOrder);

router.route("/:id/status")
  .patch(verifyToken,verifyRoles("recourse"), updateOrderStatus);

module.exports = router;