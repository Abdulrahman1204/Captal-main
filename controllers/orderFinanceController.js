const asyncHandler = require("express-async-handler");
const upload = require("../middlewares/photoUpload");
const {
  OrderFinance,
  validationOrderFinance,
  validationUpdateOrderFinance,
} = require("../models/OrderFinance");
const { cloudinaryRemoveImage } = require("../utils/cloudinary");
const { User } = require("../models/User");

// @desc    Create Order Finance
// @route   POST => /api/captal/orderFinance
// @access  Private

module.exports.createOrderFinance = [
  upload,
  asyncHandler(async (req, res) => {
    const { error } = validationOrderFinance(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ phone: req.body.phone });

    const statusUser = existingUser ? "eligible" : "visited";
    const userId = existingUser ? existingUser._id : null;

    const uploadedFile = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: "", publicId: null };

    const order = await OrderFinance.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      companyName: req.body.companyName,
      dateOfCompany: req.body.dateOfCompany,
      projectName: req.body.projectName,
      lastYearRevenue: req.body.lastYearRevenue,
      requiredAmount: req.body.requiredAmount,
      description: req.body.description,
      attachedFile: uploadedFile,
      statusUser,
      userId,
    });

    res.status(201).json({ message: "تم إنشاء طلب التمويل بنجاح", order });
  }),
];

// @desc    Get Order Finance
// @route   GET => /api/captal/orderFinance
// @access  Private

module.exports.getAllOrderFinance = asyncHandler(async (req, res) => {
  const orders = await OrderFinance.find();
  res.status(200).json(orders);
});

// @desc    Get Order Finance By ID
// @route   GET /api/captal/orderFinance/:id
// @access  Private
module.exports.getOrderFinanceById = asyncHandler(async (req, res) => {
  const order = await OrderFinance.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.status(200).json(order);
});

// @desc    Get Order Finance By User Id
// @route   GET /api/captal/orderFinance/contractor/:id
// @access  Private
module.exports.getOrdersForContractor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log({ user: req.params.id });
  if (!user) return res.status(404).json({ message: "User not found" });
  const order = await OrderFinance.find({ userId: req.params.id });
  res.status(200).json(order);
});

// @desc    Update Order Finance By ID
// @route   PUT /api/captal/orderFinance/:id
// @access  Private
module.exports.updateOrderFinance = [
  upload,
  asyncHandler(async (req, res) => {
    const { error } = validationUpdateOrderFinance(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const order = await OrderFinance.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId && order.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this order" });
    }

    let updatedFile = order.attachedFile;
    if (req.file) {
      if (order.attachedFile && order.attachedFile.publicId) {
        await cloudinaryRemoveImage(order.attachedFile.publicId);
      }

      updatedFile = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const updatedData = {
      firstName: req.body.firstName || order.firstName,
      lastName: req.body.lastName || order.lastName,
      phone: req.body.phone || order.phone,
      email: req.body.email || order.email,
      companyName: req.body.companyName || order.companyName,
      dateOfCompany: req.body.dateOfCompany || order.dateOfCompany,
      projectName: req.body.projectName || order.projectName,
      lastYearRevenue: req.body.lastYearRevenue || order.lastYearRevenue,
      requiredAmount: req.body.requiredAmount || order.requiredAmount,
      statusOrder: req.body.statusOrder || order.statusOrder,
      description: req.body.description || order.description,
      attachedFile: updatedFile,
    };

    const updatedOrder = await OrderFinance.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json({
      message: "Order updated successfully",
      updatedOrder,
    });
  }),
];

// @desc    Delete Order Finance
// @route   DELETE /api/captal/orderFinance/:id
// @access  Private
module.exports.deleteOrderFinance = asyncHandler(async (req, res) => {
  const order = await OrderFinance.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  await OrderFinance.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Order deleted successfully" });
});

// @desc    Update Order Finance Status
// @route   PUT /api/captal/orderQualification/status/:id
// @access  Private (admin or specific role)
module.exports.updateStatus = asyncHandler(async (req, res) => {
  const { error } = validationUpdateOrderFinance(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const order = await OrderFinance.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const updatedStatus = await OrderFinance.findByIdAndUpdate(
    req.params.id,
    { $set: { statusOrder: req.body.statusOrder } },
    { new: true }
  );

  res.status(200).json(updatedStatus);
});
