import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'collection_products', timestamps: true })
export class CollectionProduct {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'collections',
    required: true,
  })
  collectionId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  })
  productId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  position: number;
}
export type CollectionProductDocument = HydratedDocument<CollectionProduct>;
export const CollectionProductSchema =
  SchemaFactory.createForClass(CollectionProduct);

CollectionProductSchema.index({ collectionId: 1, position: 1 });
CollectionProductSchema.index({ productId: 1 });
CollectionProductSchema.index(
  { collectionId: 1, productId: 1 },
  { unique: true },
);
