import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  CollectionSortOrder,
  CollectionStatus,
  CollectionType,
} from '../schemas/collection.schema';

export class CreateCollectionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  handle?: string;

  @IsOptional()
  @IsString()
  descriptionHtml?: string;

  @IsOptional()
  @IsEnum(CollectionType)
  type?: CollectionType = CollectionType.MANUAL;

  @IsOptional()
  @IsEnum(CollectionStatus)
  status?: CollectionStatus = CollectionStatus.DRAFT;

  @IsOptional()
  @IsEnum(CollectionSortOrder)
  sortOrder?: CollectionSortOrder = CollectionSortOrder.MANUAL;
}
