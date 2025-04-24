const router = require("express").Router();
const {
  createClassfiMaterial,
  getAllClassfiMaterial,
  getClassfiMaterialById,
  updateClassfiMaterial,
  deleteClassfiMaterial
} = require("../controllers/classficationMaterialController");
const {verifyRoles, verifyToken} = require("../middlewares/verifyToken")

// POST /api/classificationMaterial
router.post("/",verifyToken, verifyRoles("admin"), createClassfiMaterial);

// GET /api/classificationMaterial
router.get("/", verifyToken, verifyRoles("admin"), getAllClassfiMaterial);

// GET /api/classificationMaterial/:id
router.get("/:id",verifyToken, verifyRoles("admin"), getClassfiMaterialById);

// PUT /api/classificationMaterial/:id
// router.put("/:id",verifyToken, verifyRoles("admin"), updateClassfiMaterial);

// DELETE /api/classificationMaterial/:id
router.delete("/:id",verifyToken, verifyRoles("admin"), deleteClassfiMaterial);

module.exports = router;