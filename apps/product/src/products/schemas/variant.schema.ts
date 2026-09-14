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
}

export type VariantDocument = HydratedDocument<Variant>;
export const VariantSchema = SchemaFactory.createForClass(Variant);
