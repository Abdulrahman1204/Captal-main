const express = require("express")
const router = express.Router()
const { getAllUsers, getUserByID, updateUser, deleteUser,createUser } = require("../controllers/userController");
const { verifyToken ,verifyAdmin, verifyRoles } = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');

router.route("/").get(verifyToken, getAllUsers).post(verifyToken,createUser);

router.route("/:id").get(verifyToken,validId, getUserByID).patch(verifyToken,validId, updateUser).delete(verifyToken,validId, deleteUser);

module.exports = router
