import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductReview } from '../entities/product-review.entity';
import { ProductStatus } from '../entities/product.entity';
import { ProductImageDto } from './product-image.dto';
import { ProductOptionDto } from './product-option.dto';
import { ProductVariantDto } from './product-variant.dto';

export class SeoDto {
  title?: string;
  description?: string;
}
export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus = ProductStatus.ACTIVE;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => SeoDto)
  seo?: SeoDto = {};

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[] = [];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3, { message: 'Max 3 options!' })
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDto)
  options?: ProductOptionDto[];

  handle?: string;
  descriptionHtml?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  metafields?: Record<string, any>;
  stockQuantity?: number;
  lowStockThreshold?: number;
  sku?: string;
  barcode?: string;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductReview)
  reviews?: ProductReview[];

  averageRating?: number = 0;
  reviewsCount?: number = 0;
  ratingDistribution?: Record<string, number>;
}
export class GetProductsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 15;

  search?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status: ProductStatus = ProductStatus.ACTIVE;

  vendor?: string;
  tag?: string;
  sortBy?: 'createdAt' | 'title' | 'price' = 'createdAt';
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
