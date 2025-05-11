const asyncHandler = require("express-async-handler");
const upload = require("../middlewares/photoUpload");
const { validationMatrialsOrder, Materials } = require("../models/Materials");
const {
  classificationMaterialFather,
  classificationMaterialSon,
} = require("../models/ClassificationMaterial");
const ExcelJS = require("exceljs");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const ExcelLoad = require("../middlewares/uploadExcel");
const xlsx = require("xlsx");
const mongoose = require("mongoose");

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
  const matrials = await Materials.find().populate(
    "classification",
    "fatherName sonName"
  );
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

// module.exports.updateMaterialOrder = asyncHandler(async (req, res) => {
//   const { error } = validationUpdateMatrialsOrder(req.body);
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }

//   const matrial = await Materials.findById(req.params.id);
//   if (!matrial) {
//     return res.status(404).json({ message: "Matrial not found" });
//   }

//   const existingSerial = await Materials.findOne({
//     serialNumber: req.body.serialNumber,
//   });
//   if (existingSerial) {
//     return res.status(409).json({ message: "الرقم التسلسلي مستخدم مسبقاً" });
//   }

//   const classification = await classificationMaterialFather.findById(
//     req.body.classification
//   );
//   if (!classification) {
//     return res.status(409).json({ message: "التصنيف ليس موجود" });
//   }

//   const updatedMatrial = await Materials.findByIdAndUpdate(
//     req.params.id,
//     {
//       $set: {
//         materialName: req.body.materialName,
//         serialNumber: req.body.serialNumber,
//         classification: req.body.classification,
//         attachedFile: uploadedFile,
//       },
//     },
//     { new: true }
//   );

//   res.status(200).json({
//     message: "successfully",
//     updatedMatrial,
//   });
// });

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

/**
 * @desc رفع ملف Excel واستخلاص البيانات
 * @route POST /api/upload-excel
 * @access Private/Admin
 */

module.exports.uploadExcel = asyncHandler(async (req, res) => {
  ExcelLoad(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "لم يتم رفع أي ملف",
      });
    }

    try {
      // 1. قراءة ملف Excel
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // 2. تحويل البيانات إلى JSON
      const excelData = xlsx.utils.sheet_to_json(worksheet, {
        header: ["materialName", "serialNumber", "classification", "fileUrl"],
        range: 1, // تخطي صف العناوين
      });

      console.log("البيانات المستخرجة:", excelData);

      // 3. معالجة البيانات
      const validMaterials = [];
      const errors = [];

      for (const [index, row] of excelData.entries()) {
        try {
          if (!row.materialName || !row.serialNumber || !row.classification) {
            errors.push(
              `الصف ${
                index + 2
              }: بيانات ناقصة (يجب توفير اسم المادة، الرقم التسلسلي، والتصنيف)`
            );
            continue;
          }

          // البحث عن تصنيف الأب في قاعدة البيانات
          const fatherClassification =
            await classificationMaterialFather.findOne({
              $or: [
                { name: row.classification.toString().trim() },
                { nameAr: row.classification.toString().trim() },
              ],
            });

          if (!fatherClassification) {
            errors.push(
              `الصف ${index + 2}: تصنيف غير موجود - ${row.classification}`
            );
            continue;
          }

          // التحقق من عدم تكرار الرقم التسلسلي
          const existingMaterial = await Materials.findOne({
            serialNumber: row.serialNumber.toString().trim(),
          });

          if (existingMaterial) {
            errors.push(
              `الصف ${index + 2}: الرقم التسلسلي موجود مسبقاً - ${
                row.serialNumber
              }`
            );
            continue;
          }

          validMaterials.push({
            materialName: row.materialName.toString().trim(),
            serialNumber: row.serialNumber.toString().trim(),
            classification: fatherClassification._id,
            attachedFile: {
              url: (row.fileUrl || "").toString().trim(),
            },
          });
        } catch (error) {
          errors.push(`الصف ${index + 2}: ${error.message}`);
        }
      }

      // 4. إدراج البيانات الصالحة
      if (validMaterials.length > 0) {
        const createdMaterials = await Materials.insertMany(validMaterials);

        fs.unlinkSync(req.file.path); // حذف الملف المؤقت

        return res.status(201).json({
          success: true,
          message: `تمت إضافة ${createdMaterials.length} مواد بنجاح`,
          addedCount: createdMaterials.length,
          errorCount: errors.length,
          errors: errors.length > 0 ? errors : undefined,
          data: createdMaterials,
        });
      } else {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "لم يتم إضافة أي مواد بسبب الأخطاء",
          details: {
            totalRows: excelData.length,
            skippedRows: errors.length,
            errors: errors,
          },
        });
      }
    } catch (error) {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("حدث خطأ:", error);
      return res.status(500).json({
        success: false,
        message: "حدث خطأ أثناء معالجة الملف",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });
});
