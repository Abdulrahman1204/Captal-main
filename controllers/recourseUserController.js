const asyncHandler = require("express-async-handler");
const { 
  RecourseUserOrder, 
  validateRecourseUserOrder,
  validateStatusUpdate
} = require("../models/RecourseUserOrder");

// @desc    Create new order
// @route   POST /api/recourse-user-orders
// @access  Private
module.exports.createRecourseUserOrder = asyncHandler(async (req, res) => {
  const { error } = validateRecourseUserOrder(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const order = new RecourseUserOrder({
    ...req.body,
    userId: req.user.id
  });

  await order.save();
  res.status(201).json(order);
});

// @desc    Get all orders
// @route   GET /api/recourse-user-orders
// @access  Private
module.exports.getAllRecourseUserOrders = asyncHandler(async (req, res) => {
  const orders = await RecourseUserOrder.find()
    .populate("userId", "username email")
    .populate("materials", "materialName serialNumber");

  res.status(200).json({
    count: orders.length,
    data: orders
  });
});

// @desc    Get order by ID
// @route   GET /api/recourse-user-orders/:id
// @access  Private
module.exports.getRecourseUserOrderById = asyncHandler(async (req, res) => {
  const order = await RecourseUserOrder.findById(req.params.id)
    .populate("userId", "username email")
    .populate("materials", "materialName serialNumber");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
});

// @desc    Update order
// @route   PUT /api/recourse-user-orders/:id
// @access  Private
module.exports.updateRecourseUserOrder = asyncHandler(async (req, res) => {
  const { error } = validateRecourseUserOrder(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const order = await RecourseUserOrder.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
});

// @desc    Update order status only
// @route   PATCH /api/recourse-user-orders/:id/status
// @access  Private
module.exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { error } = validateStatusUpdate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const order = await RecourseUserOrder.findByIdAndUpdate(
    req.params.id,
    { statusOrder: req.body.statusOrder },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
});

// @desc    Delete order
// @route   DELETE /api/recourse-user-orders/:id
// @access  Private
module.exports.deleteRecourseUserOrder = asyncHandler(async (req, res) => {
  const order = await RecourseUserOrder.findByIdAndDelete(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json({ message: "Order deleted successfully" });
});