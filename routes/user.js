const express = require("express")
const router = express.Router()
const { getAllUsers, getUserByID, updateUser, deleteUser,createUser } = require("../controllers/userController");
const { verifyToken , verifyRoles } = require("../middlewares/verifyToken");

router.route("/").get(verifyToken, verifyRoles("admin"), getAllUsers).post(verifyToken, verifyRoles("admin"),createUser);

router.route("/:id").get(verifyToken, verifyRoles("admin"), getUserByID).patch(verifyToken, verifyRoles("admin"), updateUser).delete(verifyToken, verifyRoles("admin"), deleteUser);

module.exports = router
