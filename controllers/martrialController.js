const asyncHandler = require("express-async-handler");
const upload = require("../middlewares/photoUpload");
const {
  validationMatrialsOrder,
  Materials,
  validationUpdateMatrialsOrder,
} = require("../models/Materials");
const { ClassificationMaterial, classificationMaterialFather } = require("../models/classificationMaterial");

/**
 * @desc Create Material Order
 * @route /api/captal/material
 * @method POST
 * @access private
 */

module.exports.createMaterialOrder = [
  upload,
  asyncHandler(async (req, res) => {
    const { error } = validationMatrialsOrder(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingSerial = await Materials.findOne({
      serialNumber: req.body.serialNumber,
    });
    if (existingSerial) {
      return res.status(409).json({ message: "الرقم التسلسلي مستخدم مسبقاً" });
    }

    const classification = await classificationMaterialFather.findById(
      req.body.classification
    );
    if (!classification) {
      return res.status(409).json({ message: "التصنيف ليس موجود" });
    }

    const uploadedFile = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: "", publicId: null };

    const matrial = await Materials.create({
      materialName: req.body.materialName,
      serialNumber: req.body.serialNumber,
      classification: req.body.classification,
      attachedFile: uploadedFile,
    });

    res.status(201).json({ message: "تم إنشاء الطلب بنجاح", matrial });
  }),
];

/**
 * @desc Get Material Order
 * @route /api/captal/material
 * @method GET
 * @access private
 */

module.exports.getAllMaterialsOrder = asyncHandler(async (req, res) => {
  const matrials = await Materials.find().populate('classification', 'fatherName sonName');
  res.status(200).json(matrials);
});

/**
 * @desc Get Matrial Order By Id
 * @route /api/captal/matrial/:id
 * @method GET
 * @access private
 */

module.exports.getMaterialOrderByID = asyncHandler(async (req, res) => {
  const material = await Materials.findById(req.params.id);
  res.status(200).json(material);
});

/**
 * @desc Update Matrial Order By Id
 * @route /api/captal/material/:id
 * @method PUT
 * @access private
 */

module.exports.updateMaterialOrder = asyncHandler(async (req, res) => {
  const { error } = validationUpdateMatrialsOrder(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const matrial = await Materials.findById(req.params.id);
  if (!matrial) {
    return res.status(404).json({ message: "Matrial not found" });
  }

  const existingSerial = await Materials.findOne({
    serialNumber: req.body.serialNumber,
  });
  if (existingSerial) {
    return res.status(409).json({ message: "الرقم التسلسلي مستخدم مسبقاً" });
  }

  const classification = await ClassificationMaterial.findById(
    req.body.classification
  );
  if (!classification) {
    return res.status(409).json({ message: "التصنيف ليس موجود" });
  }

  const updatedMatrial = await Materials.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        materialName: req.body.materialName,
        serialNumber: req.body.serialNumber,
        classification: req.body.classification,
        attachedFile: uploadedFile,
      },
    },
    { new: true }
  );

  res.status(200).json({
    message: "successfully",
    updatedMatrial,
  });
});

/**
 * @desc Delete Matrial Order
 * @route /api/captal/material/:id
 * @method DELETE
 * @access private
 */
module.exports.deleteMatrialOrder = asyncHandler(async (req, res) => {
  const matrial = await Materials.findById(req.params.id);
  if (!matrial) {
    return res.status(404).json({ message: "Matrial not found" });
  }
  const DeleteMatrial = await Materials.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: "Matrial has been deleted successfully",
    DeleteMatrial,
  });
});
