import multer from "multer";
import path from "path";
import { ingestDocument } from "../services/document.services.js";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export const getdocument = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath = req.file.path;
      const docId = req.file.filename; 

      await ingestDocument(filePath, docId);

      res.json({ message: "Document ingested successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error processing document" });
    }
  },
];

