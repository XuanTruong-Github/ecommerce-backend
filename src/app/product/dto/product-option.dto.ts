import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { OptionType } from '../entities/product-option.entity';
export class ProductOptionValueDto {
  @IsString()
  value: string;

  @IsInt()
  @IsOptional()
  position?: number;
}
export class ProductOptionDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsEnum(OptionType)
  type?: OptionType = OptionType.TEXT;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductOptionValueDto)
  values: ProductOptionValueDto[];
}
