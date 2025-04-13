const path = require("path");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  let resourceType = "auto";
  if (ext === ".pdf" || ext === ".docx" || ext === ".xlsx" || ext === ".csv") {
    resourceType = "raw";
  } else if (ext === ".mp4" || ext === ".avi" || ext === ".mov") {
    resourceType = "video";
  }
    return {
      folder: "Univers",
      public_id: `${Date.now()}_${file.originalname.split('.')[0]}`,
      resource_type: resourceType, 
      allowed_formats: ["jpg", "jpeg", "png", "mp4", "avi", "mov", "pdf"],
      type: "upload"
    };
  },
});

const upload = multer({ storage }).single("attachedFile");

module.exports = upload; 
