const express =require("express")
const router = express.Router()
const { sendForgotPasswordLink } = require("../controllers/sendEmailController");
// api/send-email
router.route("/send-email").post(sendForgotPasswordLink)



module.exports = router;