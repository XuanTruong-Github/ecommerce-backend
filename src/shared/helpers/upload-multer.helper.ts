import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

export const UPLOAD_IMAGES_DIR = join(process.cwd(), 'upload', 'images');
export const UPLOAD_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const UPLOAD_MAX_FILES = 20;

const ALLOWED_MIMETYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp']);

function ensureUploadDirExists() {
  if (!existsSync(UPLOAD_IMAGES_DIR)) {
    mkdirSync(UPLOAD_IMAGES_DIR, { recursive: true });
  }
}

function buildFilename(originalName: string): string {
  const ext = extname(originalName || '').toLowerCase();
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${uniqueSuffix}${ext}`;
}

export const uploadImageMulterOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      ensureUploadDirExists();
      cb(null, UPLOAD_IMAGES_DIR);
    },
    filename: (_req, file, cb) => {
      cb(null, buildFilename(file.originalname));
    },
  }),
  limits: {
    fileSize: UPLOAD_MAX_FILE_SIZE,
  },
  fileFilter: (
    _req: unknown,
    file: Express.Multer.File,
    cb: (error: Error | null, accept: boolean) => void,
  ) => {
    const ext = extname(file.originalname || '').toLowerCase();
    if (!ALLOWED_MIMETYPES.has(file.mimetype) || !ALLOWED_EXTENSIONS.has(ext)) {
      return cb(
        new BadRequestException(
          `Unsupported file type: ${file.originalname}. Allowed: jpg, jpeg, png, webp, gif, svg, bmp`,
        ),
        false,
      );
    }
    cb(null, true);
  },
};
