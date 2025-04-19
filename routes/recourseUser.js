const express = require("express");
const router = express.Router();
const {
  createRecourseUserOrder,
  getAllRecourseUserOrders,
  getRecourseUserOrderById,
  updateRecourseUserOrder,
  updateOrderStatus,
  deleteRecourseUserOrder,
  getLocation,
} = require("../controllers/recourseUserController");
const { verifyToken,verifyRoles} = require("../middlewares/verifyToken");

router
  .route("/")
  .post(verifyToken,verifyRoles("admin"), createRecourseUserOrder)
  .get(verifyToken,verifyRoles("recourse"), getAllRecourseUserOrders);

router.route("/:id")
  .get(verifyToken,verifyRoles("admin"), getRecourseUserOrderById)
  .put(verifyToken,verifyRoles("admin"), updateRecourseUserOrder)
  .delete(verifyToken,verifyRoles("admin"), deleteRecourseUserOrder);

router.route("/:id/status")
  .patch(verifyToken,verifyRoles("recourse"), updateOrderStatus);


router.route('/location/address-from-coords').get(verifyToken,verifyRoles("admin"),getLocation);

module.exports = router;
