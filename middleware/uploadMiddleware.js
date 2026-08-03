const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/groups");
  },

  filename: (req, file, cb) => {

    const ext = path.extname(file.originalname);

    const uniqueName =
      crypto.randomBytes(16).toString("hex") + ext;

    cb(null, uniqueName);
  },
});


const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];


  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPEG, PNG, and WebP images are allowed"
      ),
      false
    );
  }

};


const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

});


module.exports = upload;