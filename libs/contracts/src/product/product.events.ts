export const PRODUCT_EVENTS = {
  productCreated: 'product.created',
  productUpdated: 'product.updated',
  productDeleted: 'product.deleted',

  variantCreated: 'variant.created',
  variantUpdated: 'variant.updated',
  variantDeleted: 'variant.deleted',

  collectionCreated: 'collection.created',
  collectionUpdated: 'collection.updated',
  collectionDeleted: 'collection.deleted',
} as const;

export interface ProductEventPayload {
  productId: string;
  occurredAt: string; // Timestamp of event
}

export interface CollectionEventPayload {
  collectionId: string;
  occurredAt: string; // Timestamp of event
}
