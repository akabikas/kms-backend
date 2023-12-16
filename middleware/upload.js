const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const imageFilter = function (req, file, callback) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    console.log("Only jpg & png Images are allowed");
    callback(null, false);
  }
};

const fileFilter = function (req, file, callback) {
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    console.log("Only jpg, png, pdf, doc, docx, and txt files are allowed");
    callback(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 50,
};

const uploadSingleImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: limits,
});

const uploadMultipleFiles = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

module.exports = {
  uploadSingleImage,
  uploadMultipleFiles,
};
