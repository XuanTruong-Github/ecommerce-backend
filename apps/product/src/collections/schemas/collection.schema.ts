import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum CollectionType {
  MANUAL = 'manual',
  SMART = 'smart',
}

export enum CollectionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export enum CollectionSortOrder {
  MANUAL = 'manual',
  BEST_SELLING = 'best-selling',
  TITLE_ASC = 'title-asc',
  TITLE_DESC = 'title-desc',
  PRICE_ASC = 'price-asc',
  PRICE_DESC = 'price-desc',
  CREATED_DESC = 'created-desc',
}

@Schema({ collection: 'collections', timestamps: true })
export class Collection {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true, unique: true })
  handle: string;

  @Prop({ type: String })
  descriptionHtml?: string;

  @Prop({
    type: String,
    enum: CollectionType,
    default: CollectionType.MANUAL,
  })
  type: CollectionType;

  @Prop({
    type: {
      mediaId: String,
      alt: String,
    },
    default: {},
  })
  image?: {
    mediaId?: string;
    alt?: string;
  };

  @Prop({
    type: String,
    enum: CollectionSortOrder,
    default: CollectionSortOrder.MANUAL,
  })
  sortOrder: CollectionSortOrder;

  @Prop({
    type: String,
    enum: CollectionStatus,
    default: CollectionStatus.DRAFT,
  })
  status: CollectionStatus;

  @Prop({ type: Date })
  publishedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type CollectionDocument = HydratedDocument<Collection>;
export const CollectionSchema = SchemaFactory.createForClass(Collection);

CollectionSchema.index({ handle: 1 }, { unique: true });
CollectionSchema.index({ status: 1 });
