const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const extname = /\.(xlsx|xls)$/i.test(path.extname(file.originalname));
  const mimetype = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ].includes(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new Error('فقط ملفات Excel مسموح بها!'));
};

const uploadExcel = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = uploadExcel.single('ExcelFile');