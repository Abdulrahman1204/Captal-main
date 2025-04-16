const asyncHandler = require("express-async-handler")
const { User } = require("../models/User");
const nodemailer = require("nodemailer")

/*
 * @desc Send Forgot Password Link
 * @route /password/forgot-password
 * @method POST
 * @access public
 */

module.exports.sendForgotPasswordLink  = asyncHandler (async(req,res) =>{
    const user = await User.findOne({ email : req.body.email})
if(!user){
    return res.status(404).json({ message : "user not found"})
}
const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.USER_EMAIL,
        pass : process.env.USER_PASS
    }
})
const mailOption = {
    from : process.env.USER_EMAIL,
    to : user.email ,
    subject : "Send To Recourse",
    html :`<div>
    <h4> send it seccussfully</h4>
    </div>`
}
transporter.sendMail(mailOption ,function(error,success){
    if(error){
        console.log(error)
        res.status(500).json({message : "something went wrong"})
    }
    else{
        res.status(200).json({message : "Email sent "})
        user.save()
    }
})
})
