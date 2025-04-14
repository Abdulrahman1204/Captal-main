const router = require("express").Router();
const {
  createClassfiMaterial,
  getAllClassfiMaterial,
  getClassfiMaterialById,
  updateClassfiMaterial,
  deleteClassfiMaterial
} = require("../controllers/classficationMaterialController");
const {verifyAdmin} = require("../middlewares/verifyToken")

// POST /api/classificationMaterial
router.post("/",verifyAdmin, createClassfiMaterial);

// GET /api/classificationMaterial
router.get("/", verifyAdmin, getAllClassfiMaterial);

// GET /api/classificationMaterial/:id
router.get("/:id",verifyAdmin, getClassfiMaterialById);

// PUT /api/classificationMaterial/:id
router.put("/:id",verifyAdmin, updateClassfiMaterial);

// DELETE /api/classificationMaterial/:id
router.delete("/:id",verifyAdmin, deleteClassfiMaterial);

module.exports = router;