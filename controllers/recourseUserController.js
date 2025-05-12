const asyncHandler = require("express-async-handler");
const axios = require('axios');
const { 
  RecourseUserOrder, 
  validateRecourseUserOrder,
  validateStatusUpdate,
  validateUpdateRecourseUserOrder
} = require("../models/RecourseUserOrder");
const { User } = require("../models/User");
const { getAddressFromCoords } = require("../utils/location");

const upload = require("../middlewares/photoUpload");

// @desc    Create new order
// @route   POST /api/recourseUserOrder
// @access  Private
module.exports.createRecourseUserOrder = [
  upload,
  asyncHandler(async (req, res) => {
    const { error } = validateRecourseUserOrder(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
     const advance = parseFloat(req.body.advance.replace("%", "")) || 0;
    const uponDelivry = parseFloat(req.body.uponDelivry.replace("%", "")) || 0;
    const afterDelivry =
      parseFloat(req.body.afterDelivry.replace("%", "")) || 0;

    const total = advance + uponDelivry + afterDelivry;

    if (total !== 100) {
      return res
        .status(400)
        .json({ message: "مجموع الدفعات يجب أن يكون 100%" });
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
          dateOfproject: req.body.dateOfproject || new Date(),
          attachedFile: uploadedFile || { publicId: null, url: "" }, 
          materials: req.body.materials || [],
          paymentCheck: req.body.paymentCheck,
          advance: req.body.advance,
          uponDelivry: req.body.uponDelivry,
          afterDelivry: req.body.afterDelivry,
          // country: req.body.country,
          countryName: req.body.countryName,
          // postAddress: req.body.postAddress,
          // street: req.body.street,
          location: {
            type: "Point",
            coordinates: req.body.location?.coordinates || [0, 0] 
          },
          userId: userId
        });
    await order.save();
    res.status(201).json(order);
  })
]

// @desc    Get all orders
// @route   GET /api/recourseUserOrder
// @access  Private
module.exports.getAllRecourseUserOrders = asyncHandler(async (req, res) => {
  const orders = await RecourseUserOrder.find().populate('materials', 'materialName')

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
    // country: req.body.country,
    countryName: req.body.countryName,
    // postAddress: req.body.postAddress,
    // street: req.body.street
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

module.exports.getLocation = asyncHandler( async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json('Latitude and longitude are required');

    const address = await getAddressFromCoords(lat, lng);
    if (!address) return res.status(404).send('Address not found');

    res.send(address);
  } catch (err) {
    res.status(500).send('Server error');
  }
})

// @desc    Update Order recourse bill folder
// @route   PUT /api/captal/recourseUserOrder/bill/:id
// @access  Private (admin)
module.exports.updateBillFile = [
  upload,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await RecourseUserOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let updatedFile = order.billFile;

    if (req.file) {
      if (order.billFile && order.billFile.publicId) {
        await cloudinaryRemoveImage(order.billFile.publicId);
      }

      updatedFile = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    order.billFile = updatedFile;
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Bill file updated successfully",
    });
  }),
];
