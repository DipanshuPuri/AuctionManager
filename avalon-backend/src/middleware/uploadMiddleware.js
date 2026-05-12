const multer = require('multer');

// ---------------------------------------------------------------------------
// Upload Middleware – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Configures multer for in-memory file handling (no disk writes).
// Files are kept in buffer for direct upload to Supabase Storage.
// ---------------------------------------------------------------------------

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, GIF.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

module.exports = { upload };
