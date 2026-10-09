import multer from "multer";
import { env } from "../config/env";

// Memory storage: files are small (<5MB) and only ever read once to parse, never persisted
// to disk. fileFilter silently rejects non-csv files (req.file stays undefined) rather than
// throwing, so the controller can surface one clear error message.
export const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isCsv = file.mimetype === "text/csv" || file.originalname.toLowerCase().endsWith(".csv");
    cb(null, isCsv);
  },
}).single("file");
