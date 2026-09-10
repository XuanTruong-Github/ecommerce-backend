import { FileValidator } from '@nestjs/common';

export class ImageMimeTypeValidator extends FileValidator<Record<string, unknown>> {
  private readonly pattern: RegExp;

  constructor(pattern: RegExp) {
    super({});
    this.pattern = pattern;
  }

  isValid(file?: Express.Multer.File): boolean {
    if (!file?.mimetype) return false;
    return this.pattern.test(file.mimetype);
  }

  buildErrorMessage(): string {
    return `Validation failed (invalid file type; expected ${this.pattern})`;
  }
}
