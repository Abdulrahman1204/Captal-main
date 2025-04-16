const asyncHandler = require("express-async-handler");
const { 
  RecourseUserOrder, 
  validateRecourseUserOrder,
  validateStatusUpdate,
  validateUpdateRecourseUserOrder
} = require("../models/RecourseUserOrder");
const { User } = require("../models/User");

// @desc    Create new order
// @route   POST /api/recourseUserOrder
// @access  Private
module.exports.createRecourseUserOrder = asyncHandler(async (req, res) => {
  const { error } = validateRecourseUserOrder(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
      const existingUser = await User.findOne({ phone: req.body.recoursePhone });
      console.log(existingUser);
      const userId = existingUser ? existingUser._id : null;

      const uploadedFile = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: "", publicId: null };

  const order = new RecourseUserOrder({
    recourseName: req.body.recourseName,
    recoursePhone: req.body.recoursePhone,
    clientName: req.body.clientName,
    clientPhone: req.body.clientPhone,
    serialNumber: req.body.serialNumber,
    projectName: req.body.projectName,
    dateOfproject: req.body.dateOfproject,
    attachedFile: uploadedFile,
    materials: req.body.materials || null,
    paymentCheck: req.body.paymentCheck,
    advance: req.body.advance,
    uponDelivry: req.body.uponDelivry,
    afterDelivry: req.body.afterDelivry,
    country: req.body.country,
    countryName: req.body.countryName,
    postAddress: req.body.postAddress,
    street: req.body.street,
    userId : userId
  });

  await order.save();
  res.status(201).json(order);
});

// @desc    Get all orders
// @route   GET /api/recourseUserOrder
// @access  Private
module.exports.getAllRecourseUserOrders = asyncHandler(async (req, res) => {
  const orders = await RecourseUserOrder.find()

  res.status(200).json({
    count: orders.length,
    data: orders
  });
});

// @desc    Get order by ID
// @route   GET /api/recourseUserOrder/:id
// @access  Private
module.exports.getRecourseUserOrderById = asyncHandler(async (req, res) => {
  const order = await RecourseUserOrder.findById(req.params.id)


  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
});

// @desc    Update order
// @route   PUT /api/recourseUserOrder/:id
// @access  Private
module.exports.updateRecourseUserOrder = asyncHandler(async (req, res) => {
  const { error } = validateUpdateRecourseUserOrder(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false,
      message: error.details[0].message 
    });
  }

  const order = await RecourseUserOrder.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ 
      success: false,
      message: "Order not found" 
    });
  }

  let updatedFile = { ...order.attachedFile };
  if (req.file) {
    try {
      if (order.attachedFile?.publicId) {
        await cloudinaryRemoveImage(order.attachedFile.publicId);
      }
      
      updatedFile = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    } catch (uploadError) {
      console.error('File upload failed:', uploadError);
      return res.status(500).json({
        success: false,
        message: "Failed to update file"
      });
    }
  }

  const updateFields = {
    recourseName: req.body.recourseName,
    recoursePhone: req.body.recoursePhone,
    clientName: req.body.clientName,
    clientPhone: req.body.clientPhone,
    projectName: req.body.projectName,
    dateOfproject: req.body.dateOfproject || order.dateOfproject,
    attachedFile: updatedFile,
    materials: req.body.materials || order.materials,
    paymentCheck: req.body.paymentCheck || order.paymentCheck,
    advance: req.body.advance,
    uponDelivry: req.body.uponDelivry,
    afterDelivry: req.body.afterDelivry,
    country: req.body.country,
    countryName: req.body.countryName,
    postAddress: req.body.postAddress,
    street: req.body.street
  };

  try {
    const updatedOrder = await RecourseUserOrder.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { 
        new: true,
        runValidators: true 
      }
    ).lean();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (dbError) {
    console.error('Database update failed:', dbError);
    res.status(500).json({
      success: false,
      message: "Failed to update order"
    });
  }
});

// @desc    Update order status only
// @route   PATCH /api/recourseUserOrder/:id/status
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
// @route   DELETE /api/recourseUserOrder/:id
// @access  Private
module.exports.deleteRecourseUserOrder = asyncHandler(async (req, res) => {
  const order = await RecourseUserOrder.findByIdAndDelete(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json({ message: "Order deleted successfully" });
});