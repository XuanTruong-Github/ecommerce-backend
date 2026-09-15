import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RabbitMQService, REDIS_CLIENT } from '@app/messaging';
import Redis from 'ioredis';
import { CreateProductDto } from './dto/create-product.dto';
import slugify from 'slugify';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly rabbitmq: RabbitMQService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private productCacheKey(handle: string) {
    return `storefront:product:handle:`;
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
      options: dto?.options || [],
      tags: dto?.tags || [],
    });
  }
  async findAll() {}
  async findById(id: string) {}
}
