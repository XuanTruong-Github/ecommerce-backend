import { IsNotEmpty, IsString } from 'class-validator';

export class ProductImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  alt?: string;
  position?: number;
  isPrimary?: boolean = false;
}
