import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { PaginationType } from 'src/common/decorators/pagination.decorator';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProductService.name);
  }
  create(createProductDto: CreateProductDto) {
    try {
      const haveVariants = createProductDto.options.length > 0;
      if (!haveVariants) {
      }
      const newProduct = {
        ...createProductDto,
        images: createProductDto.images.map((item, index) => ({
          ...item,
          position: index,
          isPrimary: index === 0,
        })),
      };
      return newProduct;
    } catch (error: any) {
      this.logger.error({
        msg: 'Failed to create product',
        error: error?.message,
      });
      throw error;
    }
  }

  async findAll(pagination: PaginationType) {
    const [data, count] = await this.productRepository.findAndCount({
      take: pagination.limit,
      skip: pagination.skip,
    });
    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: count,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
