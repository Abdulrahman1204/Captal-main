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
const validId = require("../middlewares/validateId")

router.route("/")
  .post(verifyAdmin, createRecourseUserOrder)
  .get(verifyToken, verifyRoles("recourse"),getAllRecourseUserOrders);

router.route("/:id")
  .get(verifyAdmin,validId, getRecourseUserOrderById)
  .put(verifyAdmin,validId, updateRecourseUserOrder)
  .delete(verifyAdmin,validId, deleteRecourseUserOrder);

router.route("/:id/status")
  .patch(verifyToken,verifyRoles("recourse"),validId, updateOrderStatus);

module.exports = router;