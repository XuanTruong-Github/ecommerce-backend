import { IsArray, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  title: string;

  sku?: string;

  @IsArray()
  optionValues: Array<{
    name: string;
    value: string;
  }>;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  compareAtPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}
