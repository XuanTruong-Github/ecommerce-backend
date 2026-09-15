import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RabbitMQService, REDIS_CLIENT } from '@app/messaging';
import Redis from 'ioredis';
import { CreateProductDto } from './dto/create-product.dto';
import slugify from 'slugify';
import { PRODUCT_EVENTS } from '@app/contracts';
import { ProductStatus } from './products.enum';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly rabbitmq: RabbitMQService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async findAll(query: Record<string, any>) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (query.status) {
      filter.status = query.status;
    } else {
      filter.status = ProductStatus.ACTIVE;
    }

    if (query?.vendor) {
      filter.vendor = query.vendor;
    }

    if (query.productType) {
      filter.productType = query.productType;
    }

    if (query.tag) {
      filter.tags = query.tag;
    }

    const sort: Record<string, any> = {};

    switch (query.sort) {
      case 'price_asc':
        sort.minPrice = 1;
        break;
      case 'price_desc':
        sort.minPrice = -1;
        break;
      case 'title_asc':
        sort.title = 1;
        break;
      case 'title_desc':
        sort.title = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    const [data, total] = await Promise.all([
      this.productModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException('Product not found!');
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException('Product not found!');
    return product;
  }

  async findByHandle(handle: string) {
    const cacheKey = this.productCacheKey(handle);
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
    const product = await this.productModel
      .findOne({
        handle,
        status: ProductStatus.ACTIVE,
      })
      .lean();
    if (!product) throw new NotFoundException('Product not found!');
    await this.redis.set(cacheKey, JSON.stringify(product), 'EX', 500);
    return product;
  }

  async create(dto: CreateProductDto) {
    const handle =
      dto?.handle ||
      slugify(dto.title, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: true,
        locale: 'vi',
        trim: true,
      });
    const existing = await this.productModel.findOne({ handle });
    if (existing) {
      throw new ConflictException('Handle already exists!');
    }
    const product = await this.productModel.create({
      ...dto,
      handle,
    });

    await this.rabbitmq.publish(PRODUCT_EVENTS.productCreated, {
      productId: product._id.toString(),
      occurredAt: new Date().toISOString(),
    });
    await this.deleteProductCache(handle);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findById(id);
    if (dto?.handle !== product.handle) {
      const existing = await this.productModel.findOne({ handle: dto.handle });
      if (existing) throw new ConflictException('Handle already exists!');
    }
    const updated = await this.productModel
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .lean();
    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    await this.rabbitmq.publish(PRODUCT_EVENTS.productUpdated, {
      productId: updated._id.toString(),
      occurredAt: new Date().toISOString(),
    });
    if (updated?.handle) {
      await this.deleteProductCache(updated.handle);
    }
    return updated;
  }

  async remove(id: string) {
    const product = await this.findById(id);
    await this.productModel.findByIdAndDelete(id);
    await this.rabbitmq.publish(PRODUCT_EVENTS.productDeleted, {
      productId: product._id.toString(),
      occurredAt: new Date().toISOString(),
    });
    await this.deleteProductCache(product.handle);
    return { success: true };
  }

  private productCacheKey(handle: string) {
    return `storefront:product:handle:`;
  }
  private async deleteProductCache(handle: string) {
    const cacheKey = this.productCacheKey(handle);
    await this.redis.del(cacheKey);
  }
}
