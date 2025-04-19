const asyncHandler = require("express-async-handler");
const { classificationMaterialFather, validationClassficationMatrialsFather } = require("../models/classificationMaterial");

// @desc    Create new classification material
// @route   POST /api/classificationMaterialFather
// @access  private
module.exports.createClassfiMaterial = asyncHandler(async (req, res) => {
  const { error } = validationClassficationMatrialsFather(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const classficationMaterial = await classificationMaterialFather.create({
    fatherName: req.body.fatherName,
  });
  res.status(201).json({
    message: "Classification material created successfully",
    data: classficationMaterial
  });
});

// @desc    Get all classification materials
// @route   GET /api/classificationMaterialFather
// @access  private
module.exports.getAllClassfiMaterial = asyncHandler(async (req, res) => {
  const materials = await classificationMaterialFather.find().populate('sonNames', 'sonName ');
  res.status(200).json({
    count: materials.length,
    data: materials
  });
});

// @desc    Get single classification material by ID
// @route   GET /api/classificationMaterialFather/:id
// @access  private
module.exports.getClassfiMaterialById = asyncHandler(async (req, res) => {
  const material = await classificationMaterialFather.findById(req.params.id).populate('materials');
  if (!material) {
    return res.status(404).json({ message: "Classification material not found" });
  }
  res.status(200).json(material);
});

// @desc    Update classification material
// @route   PUT /api/classificationMaterialFather/:id
// @access  private
module.exports.updateClassfiMaterial = asyncHandler(async (req, res) => {
  const { error } = validationClassficationMatrialsFather(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const updatedMaterial = await classificationMaterialFather.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        fatherName: req.body.fatherName,
      }
    },
    { new: true }
  );

  if (!updatedMaterial) {
    return res.status(404).json({ message: "Classification material not found" });
  }

  res.status(200).json({
    message: "Classification material updated successfully",
    data: updatedMaterial
  });
});

// @desc    Delete classification material
// @route   DELETE /api/classificationMaterialFather/:id
// @access  private
module.exports.deleteClassfiMaterial = asyncHandler(async (req, res) => {
  const material = await classificationMaterialFather.findByIdAndDelete(req.params.id);
  if (!material) {
    return res.status(404).json({ message: "Classification material not found" });
  }
  res.status(200).json({
    message: "Classification material deleted successfully",
    data: material
  });
});