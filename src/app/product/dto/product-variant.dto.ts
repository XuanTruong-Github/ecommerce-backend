import { IsArray, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class ProductVariantDto {
  @IsString()
  title: string;

  sku?: string;
  barcode?: string;

  @IsNumber()
  @Min(0)
  price: number;

  compareAtPrice?: number;
  stockQuantity?: number = 0;
  lowStockThreshold?: number;

  imageId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  optionValues?: string[];
}
