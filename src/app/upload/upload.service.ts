import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { UploadedImageDto } from './dto/upload-response.dto';
import { UPLOAD_IMAGES_DIR } from '../../shared/helpers/upload-multer.helper';

const SAFE_FILENAME_REGEX = /^[a-zA-Z0-9._-]+$/;

@Injectable()
export class UploadService {
  toResponse(file: Express.Multer.File): UploadedImageDto {
    return {
      filename: file.filename,
      url: `/upload/images/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  toListResponse(files: Express.Multer.File[]): UploadedImageDto[] {
    return files.map((file) => this.toResponse(file));
  }

  resolvePreviewPath(filename: string): string {
    if (!SAFE_FILENAME_REGEX.test(filename)) {
      throw new NotFoundException('Image not found');
    }
    const filePath = join(UPLOAD_IMAGES_DIR, filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }
    return filePath;
  }
}
