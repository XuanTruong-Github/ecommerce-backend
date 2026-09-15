import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductStatus } from '../products.enum';

export class SeoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateProductDto {
  @IsString()
  title: string;

  handle?: string;
  descriptionHtml?: string;
  vendor?: string;
  productType?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  tags?: string[] = [];

  @IsOptional()
  @IsArray()
  options?: Array<{ name: string; position: number; values: string[] }> = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  collections?: string[] = [];

  @IsOptional()
  @IsObject()
  seo?: {
    title?: string;
    description?: string;
  };
}
