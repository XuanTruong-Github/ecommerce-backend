import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { ProductStatus } from '../products.enum';
@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  @Prop({ required: true, maxLength: 255 })
  title: string;

  @Prop({ type: String, unique: true })
  handle: string;

  @Prop({ type: String })
  descriptionHtml?: string;

  @Prop({ type: String })
  vendor?: string;

  @Prop({ type: String })
  productType?: string;

  @Prop({
    type: String,
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status?: ProductStatus;

  @Prop({
    type: [
      {
        name: String,
        position: Number,
        values: [String],
      },
    ],
    default: [],
  })
  tags?: string[];

  @Prop({
    type: [
      {
        name: String,
        position: Number,
        values: [String],
      },
    ],
    default: [],
  })
  options: Array<{ name: string; position: number; values: string[] }>;

  @Prop({
    type: [
      {
        mediaId: mongoose.Schema.Types.ObjectId,
        position: Number,
        alt: String,
      },
    ],
    default: [],
  })
  media: Array<{ mediaId: Types.ObjectId; position: number; alt?: string }>;

  @Prop({
    type: {
      title: String,
      description: String,
    },
    default: {},
  })
  seo: {
    title?: string;
    description?: string;
  };

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Collection',
    default: [],
  })
  collections: Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  availableForSale: boolean;

  @Prop({ type: Date })
  publishedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ handle: 1 }, { unique: true });
ProductSchema.index({ status: 1 });
ProductSchema.index({ vendor: 1 });
ProductSchema.index({ productType: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ createdAt: -1 });
