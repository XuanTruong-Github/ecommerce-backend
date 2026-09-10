import { ApiProperty } from '@nestjs/swagger';

export class UploadedImageDto {
  @ApiProperty({ example: '1757400000000-123456789.jpg' })
  filename: string;

  @ApiProperty({ example: '/upload/images/1757400000000-123456789.jpg' })
  url: string;

  @ApiProperty({ example: 'image/jpeg' })
  mimetype: string;

  @ApiProperty({ example: 102400 })
  size: number;
}
