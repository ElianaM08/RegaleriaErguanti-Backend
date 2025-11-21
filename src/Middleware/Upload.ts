import multer from "multer";
import path from "path";

const upload = multer({
  dest: path.join(__dirname, "../../uploads/"),
});

export default upload;
