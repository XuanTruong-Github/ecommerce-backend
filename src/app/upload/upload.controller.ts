import {
  Controller,
  Get,
  Param,
  ParseFilePipe,
  MaxFileSizeValidator,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImageMimeTypeValidator } from './validators/image-mimetype.validator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiBody, ApiConsumes, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadedImageDto } from './dto/upload-response.dto';
import {
  UPLOAD_MAX_FILE_SIZE,
  UPLOAD_MAX_FILES,
  uploadImageMulterOptions,
} from '../../shared/helpers/upload-multer.helper';

const IMAGE_MIMETYPE_PATTERN = /^image\/(jpeg|png|webp|gif|svg\+xml|bmp)$/;

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload 1 file ảnh' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
      required: ['image'],
    },
  })
  @UseInterceptors(FileInterceptor('image', uploadImageMulterOptions))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: UPLOAD_MAX_FILE_SIZE }),
          new ImageMimeTypeValidator(IMAGE_MIMETYPE_PATTERN),
        ],
      }),
    )
    file: Express.Multer.File,
  ): UploadedImageDto {
    return this.uploadService.toResponse(file);
  }

  @Post('images')
  @ApiOperation({ summary: 'Upload nhiều file ảnh (tối đa 20 files)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['images'],
    },
  })
  @UseInterceptors(FilesInterceptor('images', UPLOAD_MAX_FILES, uploadImageMulterOptions))
  uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: UPLOAD_MAX_FILE_SIZE }),
          new ImageMimeTypeValidator(IMAGE_MIMETYPE_PATTERN),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): UploadedImageDto[] {
    return this.uploadService.toListResponse(files);
  }

  @Get('preview/:filename')
  @ApiOperation({ summary: 'Preview ảnh (trả file stream để hiển thị trực tiếp)' })
  @ApiProduces('image/*')
  preview(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.uploadService.resolvePreviewPath(filename);
    return res.sendFile(filePath);
  }
}
