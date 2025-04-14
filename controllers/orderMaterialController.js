const asyncHandler = require("express-async-handler");
const upload = require("../middlewares/photoUpload");
const { MaterialsOrder, validateCreateMatrialOrder, validateUpdateMatrialOrder } = require("../models/OrderMaterial");
const { validationUpdateMatrialsOrder } = require("../models/Materials");
const { User } = require("../models/User");


// @desc    Create Order Material
// @route   POST /api/captal/orderMaterial
// @access  Private
module.exports.createOrderMaterial = [
  upload,
  asyncHandler(async (req, res) => {
    const { error } = validateCreateMatrialOrder(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ phone: req.body.phone });

    const statusUser = existingUser ? "eligible" : "visited";
    const userId = existingUser ? existingUser._id : null;

    const uploadedFile = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: "", publicId: null };

    const materialOrder = await MaterialsOrder.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      companyName: req.body.companyName,
      dateOfCompany: req.body.dateOfCompany,
      materials: req.body.materials,
      noteForQuantity: req.body.noteForQuantity,
      description: req.body.description,
      attachedFile: uploadedFile,
      statusUser,
      userId
    });

    res.status(201).json({ message: "Order created successfully", materialOrder });
  }),
];


// @desc    Get Order Material
// @route   GET /api/captal/orderMaterial
// @access  Private

module.exports.getAllOrderMaterials = asyncHandler(async (req, res) => {
  const orders = await MaterialsOrder.find();
  res.status(200).json(orders);
});

// @desc    Get Order Material By ID
// @route   GET /api/captal/orderMaterial
// @access  Private

module.exports.getOrderMaterialById = asyncHandler(async (req, res) => {
  const order = await MaterialsOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.status(200).json(order);
});

// @desc    Get Order Material By UserId
// @route   PUT /api/captal/orderMaterial/contractor/:id
// @access  Private
module.exports.getOrdersForContractor = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.params.id)
  console.log({user: req.params.id})
  if (!user) return res.status(404).json({ message: "User not found" });
  const order = await MaterialsOrder.find({userId: req.params.id});
  res.status(200).json(order)
})

// @desc    Update Order Material By ID
// @route   PUT /api/captal/orderMaterial/:id
// @access  Private
module.exports.updateOrderMaterial = [
  upload,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateMatrialOrder(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const order = await OrderFinance.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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
      materials: req.body.materials || order.materials,
      noteForQuantity: req.body.noteForQuantity || order.noteForQuantity,
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


// @desc    delete Order Material By ID
// @route   DELETE /api/captal/orderMaterial/:id
// @access  Private
module.exports.deleteOrderMaterial = asyncHandler(async (req, res) => {
  const order = await MaterialsOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  await MaterialsOrder.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Order deleted successfully" });
});

// @desc    Update Order Material Status
// @route   PUT /api/captal/orderMaterial/status/:id
// @access  Private (admin or specific role)
module.exports.updateStatus = asyncHandler(async (req, res) => {
  const { error } = validateUpdateMatrialOrder(req.body); // Fixed function name
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  const order = await MaterialsOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const updatedStatus = await MaterialsOrder.findByIdAndUpdate(
    req.params.id,
    { $set: { statusOrder: req.body.statusOrder } },
    { new: true }
  );

  res.status(200).json(updatedStatus);
});

