import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationType } from 'src/common/decorators/pagination.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProductService.name);
  }
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
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
