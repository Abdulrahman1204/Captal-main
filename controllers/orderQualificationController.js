const asyncHandler = require("express-async-handler");
const upload  = require("../middlewares/photoUpload");
const {
  validationOrderQualification,
  validationUpdateOrderQualification,
  OrderQualification,
} = require("../models/OrderQualification");

// @desc    Create Order Qualification
// @route   POST /api/captal/orderQualification
// @access  Private
module.exports.createOrderQualification = [
  upload,
  asyncHandler(async (req, res) => {
    const { error } = validationOrderQualification(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const uploadedFile = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: "", publicId: null };

    const order = await OrderQualification.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      companyName: req.body.companyName,
      dateOfCompany: req.body.dateOfCompany,
      lastYearRevenue: req.body.lastYearRevenue,
      requiredAmount: req.body.requiredAmount,
      description: req.body.description,
      attachedFile: uploadedFile,
    });

    res.status(201).json({ message: "Order created successfully", order });
  }),
];

// @desc    Get All Orders Qualification
// @route   GET /api/orderQualification
// @access  Private (admin)
module.exports.getAllOrderQualifications = asyncHandler(async (req, res) => {
  const orders = await OrderQualification.find();
  res.status(200).json(orders);
});

// @desc    Get OrderQualification By ID
// @route   GET /api/captal/orderQualification/:id
// @access  Private    
module.exports.getOrderQualificationById = asyncHandler(async (req, res) => {
  const order = await OrderQualification.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.status(200).json(order);
});

// @desc    Update Order Qualification
// @route   PUT /api/captal/orderQualification/:id
// @access  Private
module.exports.updateOrderQualification = asyncHandler(async (req, res) => {
  const { error } = validationUpdateOrderQualification(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const order = await OrderQualification.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "You are not allowed to update this order" });
  }

  const updatedOrder = await OrderQualification.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        companyName: req.body.companyName,
        DateOfCompany: req.body.DateOfCompany,
        LastYearRevenue: req.body.LastYearRevenue,
        RequiredAmount: req.body.RequiredAmount,
        description: req.body.description,
      },
    },
    { new: true }
  );

  res.status(200).json(updatedOrder);
});

// @desc    Delete Order
// @route   DELETE /api/captal/order/:id
// @access  Private (user)
module.exports.deleteOrderQualification = asyncHandler(async (req, res) => {
  const order = await OrderQualification.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  await OrderQualification.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Order deleted successfully" });
});

// @desc    Update Order Qualification Status
// @route   PUT /api/captal/orderQualification/status/:id
// @access  Private (admin or specific role)
module.exports.updateStatus = asyncHandler(async (req, res) => {
  const { error } = validationUpdateOrderQualification(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  const order = await OrderQualification.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const updatedStatus = await OrderQualification.findByIdAndUpdate(
    req.params.id,
    { $set: { statusOrder: req.body.statusOrder } },
    { new: true }
  );

  res.status(200).json(updatedStatus);
});
