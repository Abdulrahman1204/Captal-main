const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/token");
const { User } = require("../models/User");

// توليد كود OTP من 6 أرقام
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * @desc إرسال كود OTP للمستخدم
 * @route POST /api/captal/auth/send-otp
 * @access Public
 */
const sendOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: "رقم الهاتف مطلوب" });
  }

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(404).json({ message: "رقم الهاتف غير مسجل لدينا" });
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // صلاحية 10 دقائق

  user.otp = otp;
  user.expiresAt = expiresAt;
  await user.save();

  res.status(200).json({
    message: "تم إرسال كود التحقق بنجاح",
    user: user._id,
    otp: user.otp,
  });
});

/**
 * @desc التحقق من كود OTP وتسجيل الدخول
 * @route POST /api/captal/auth/verify-otp
 * @access Public
 */
const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  // تحقق من صحة OTP
  const user = await User.findById(req.params.id).select("+otp +expiresAt");
  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: "كود التحقق غير صحيح" });
  }

  // تحقق من انتهاء الصلاحية
  if (new Date(user.expiresAt) < new Date()) {
    return res.status(400).json({ message: "انتهت صلاحية الكود" });
  }

  // تحديث المستخدم وإزالة OTP
  await User.findByIdAndUpdate(user._id, {
    $unset: { otp: 1, expiresAt: 1 },
  });

  // إنشاء التوكن
  const token = generateToken(user);

  // إعداد خيارات الكوكي
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // أسبوع واحد
  };

  // إرسال الاستجابة
  res
    .cookie("token", token, cookieOptions)
    .status(200)
    .json({
      message: "تم تسجيل الدخول بنجاح",
      user: {
        _id: user._id,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
});

module.exports = {
  sendOTP,
  verifyOTP,
};
