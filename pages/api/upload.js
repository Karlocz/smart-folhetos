import multer from "multer";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = "./public/uploads";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
});

const uploadMiddleware = upload.single("file");

export default function handler(req, res) {
  uploadMiddleware(req, res, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro no upload." });
    }
    res.status(200).json({ message: "Arquivo enviado com sucesso!" });
  });
}