const asyncHandler = require("express-async-handler");
const { classificationMaterialSon, validationClassficationMatrialsSon, classificationMaterialFather,validationUpdateClassficationMatrialsSon } = require("../models/classificationMaterial");

// @desc    Create new classification material
// @route   POST /api/classificationMaterialSon
// @access  private
module.exports.createClassfiMaterial = asyncHandler(async (req, res) => {
  const { error } = validationClassficationMatrialsSon(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const father = await classificationMaterialFather.findById(req.body.fatherName);
  if (!father) {
    return res.status(404).json({ message: "Father not found" });
  }
  const classficationMaterial = await classificationMaterialSon.create({
    fatherName: req.body.fatherName,
    sonName: req.body.sonName
  });
  res.status(201).json({
    message: "Classification material created successfully",
    data: classficationMaterial
  });
});

// @desc    Get all classification materials
// @route   GET /api/classificationMaterialSon
// @access  private
module.exports.getAllClassfiMaterial = asyncHandler(async (req, res) => {
  const materials = await classificationMaterialSon.find().populate('fatherName', 'fatherName');
  res.status(200).json({
    count: materials.length,
    data: materials
  });
});

// @desc    Get single classification material by ID
// @route   GET /api/classificationMaterialSon/:id
// @access  private
module.exports.getClassfiMaterialById = asyncHandler(async (req, res) => {
  const material = await classificationMaterialSon.findById(req.params.id)
  if (!material) {
    return res.status(404).json({ message: "Classification material not found" });
  }
  res.status(200).json(material);
});

// @desc    Update classification material
// @route   PUT /api/classificationMaterialSon/:id
// @access  private
module.exports.updateClassfiMaterial = asyncHandler(async (req, res) => {
  const { error } = validationUpdateClassficationMatrialsSon(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const father = await classificationMaterialFather.findById(req.body.fatherName);
  if (!father) {
    return res.status(404).json({ message: "Father not found" });
  }
  const updatedMaterial = await classificationMaterialSon.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        fatherName: req.body.fatherName,
        sonName: req.body.sonName
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
// @route   DELETE /api/classificationMaterialSon/:id
// @access  private
module.exports.deleteClassfiMaterial = asyncHandler(async (req, res) => {
  const material = await classificationMaterialSon.findByIdAndDelete(req.params.id);
  if (!material) {
    return res.status(404).json({ message: "Classification material not found" });
  }
  res.status(200).json({
    message: "Classification material deleted successfully",
    data: material
  });
});