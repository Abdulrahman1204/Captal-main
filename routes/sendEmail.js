const express =require("express")
const router = express.Router()
const { sendForgotPasswordLink } = require("../controllers/sendEmailController");
const { verifyRoles, verifyToken } = require("../middlewares/verifyToken");
// api/send-email
router.route("/send-email").post(verifyToken,verifyRoles("admin"),sendForgotPasswordLink)



module.exports = router;