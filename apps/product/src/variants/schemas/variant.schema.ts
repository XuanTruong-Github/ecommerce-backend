import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'variants' })
export class Variant {
  @Prop({ type: mongoose.Schema.Types, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  sku?: string;

  @Prop()
  barcode?: string;

  @Prop({
    type: [
      {
        name: String,
        value: String,
      },
    ],
    default: [],
  })
  optionValues: Array<{
    name: string;
    value: string;
  }>;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Prop({ type: Number })
  compareAtPrice?: number;

  @Prop({
    type: {
      value: Number,
      unit: String,
    },
  })
  weight?: {
    value: number;
    unit: string;
  };

  @Prop({ type: Boolean, default: true })
  requiresShipping: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
  })
  mediaId?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  position: number;

  @Prop({
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: string;

  createdAt: Date;
  updatedAt: Date;
}

export type VariantDocument = HydratedDocument<Variant>;
export const VariantSchema = SchemaFactory.createForClass(Variant);
VariantSchema.index({ productId: 1 });
VariantSchema.index({ sku: 1 });
VariantSchema.index({ status: 1 });
