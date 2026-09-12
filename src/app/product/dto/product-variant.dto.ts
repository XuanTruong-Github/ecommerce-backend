import { IsArray, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class ProductVariantDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  stockQuantity?: number = 0;

  @IsInt()
  @IsOptional()
  lowStockThreshold?: number;

  @IsOptional()
  @IsUUID('all')
  imageId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  optionValues?: string[];
}
