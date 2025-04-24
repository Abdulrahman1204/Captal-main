const router = require("express").Router();
const {createClassfiMaterial,deleteClassfiMaterial,getAllClassfiMaterial,getClassfiMaterialById,updateClassfiMaterial} = require("../controllers/classficationMaterialSonController");
const {verifyRoles, verifyToken} = require("../middlewares/verifyToken")

// POST /api/classificationMaterialSon
router.route("/")
  .post(verifyToken, verifyRoles("admin"), createClassfiMaterial)
  .get(verifyToken, verifyRoles("admin"), getAllClassfiMaterial);

// GET /api/classificationMaterialSon/:id
router.route("/:id")
  .get(verifyToken, verifyRoles("admin"), getClassfiMaterialById)
  .delete(verifyToken, verifyRoles("admin"), deleteClassfiMaterial);
  // .put(verifyToken, verifyRoles("admin"), updateClassfiMaterial)

module.exports = router;