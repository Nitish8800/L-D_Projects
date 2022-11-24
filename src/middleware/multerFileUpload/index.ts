import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/video");
  },
  filename: function (req, file, cb) {
    // generate the public name, removing problematic characters
    const originalName = encodeURIComponent(
      path.parse(file.originalname).name
    ).replace(/[^a-zA-Z0-9]/g, "");
    const timestamp = Date.now();
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, originalName + "_" + timestamp + extension);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mb
  fileFilter: (req, file, callback) => {
    const acceptableExtensions = ["mp4"];
    if (
      !acceptableExtensions.some(
        (extension) =>
          path.extname(file.originalname).toLowerCase() === `.${extension}`
      )
    ) {
      return callback(
        new Error(
          `Extension not allowed, accepted extensions are ${acceptableExtensions.join(
            ","
          )}`
        )
      );
    }
    callback(null, true);
  },
});
