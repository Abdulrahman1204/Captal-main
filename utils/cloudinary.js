const cloudinary = require("cloudinary").v2;

// ⚙️ إعداد الاتصال بـ Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ☁️ رفع صورة إلى Cloudinary
const cloudinaryUploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return {
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    return {
      success: false,
      message: "Failed to upload image",
      error: error.message,
    };
  }
};

// ❌ حذف صورة من Cloudinary باستخدام الـ public_id
const cloudinaryRemoveImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Cloudinary Remove Error:", error.message);
    return {
      success: false,
      message: "Failed to delete image",
      error: error.message,
    };
  }
};

module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
};
