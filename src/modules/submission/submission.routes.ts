import { Router } from 'express';
import { SubmissionController } from './submission.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authGuard } from '../../core/middleware/authGuard';

const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads', 'submissions');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, `${timestamp}-${random}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

// Base path /api/submissions
const router = Router();
const controller = new SubmissionController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post('/', authGuard, upload.single('file'), controller.create);

router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export const submissionRoutes = router;
