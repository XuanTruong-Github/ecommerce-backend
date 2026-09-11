import { BaseEntity } from 'src/configs/database/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('reviews')
@Index(['productId', 'createdAt'])
@Index(['productId', 'rating'])
@Index(['variantId', 'rating'])
export class ProductReview extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  productId: string;
  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  variantId: string | null;

  @ManyToOne(() => ProductVariant, (variant) => variant.reviews, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant | null;

  @Column({ type: 'text' })
  review: string;

  @Column({ type: 'varchar', length: 255 })
  customerName: string;

  @Index()
  @Column({ type: 'smallint', default: 5 })
  rating: number;

  @OneToMany(() => ProductReviewImage, (image) => image.review, {
    cascade: ['insert', 'update'],
    orphanedRowAction: 'delete',
  })
  images: ProductReviewImage[];
}
@Entity('review_images')
export class ProductReviewImage extends BaseEntity {
  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'varchar', nullable: true })
  alt: string | null;

  @Index()
  @Column({ type: 'uuid' })
  reviewId: string;

  @ManyToOne(() => ProductReview, (review) => review.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'review_id' })
  review: ProductReview;
}
