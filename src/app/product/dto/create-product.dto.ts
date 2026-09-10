export class CreateProductDto {
  categoryId?: string;
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity?: number;
  sku?: string;
  ratingAverage?: number;
  reviewCount?: number;
  hasVariants?: boolean;
  weight?: number;
}
