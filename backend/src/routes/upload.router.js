import path from "path";
import express from "express";
import multer from "multer";

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    console.log(file);
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const mimetypes = /image\/jpeg|image\/png|image\/webp|image\/jpg/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // const extname = true;
  const mimetype = mimetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

uploadRouter.route("/").post(uploadSingleImage, (req, res) => {
  console.log(req.file.filename);
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ message: "image Uploaded", image: `/${req.file.path}` });
});

export default uploadRouter;
