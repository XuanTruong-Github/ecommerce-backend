import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { createHandle, createSKU } from 'src/shared/helpers/product.helper';
import { includeColumns } from 'src/shared/utils/typeorm-select-columns';
import { DataSource, FindOptionsWhere, ILike, Raw, Repository } from 'typeorm';
import { CreateProductDto, GetProductsDto, UpdateProductDto } from './dto/product.dto';
import { ProductOptionValue } from './entities/product-option-value.entity';
import { OptionType, ProductOption } from './entities/product-option.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly logger: PinoLogger,
    private readonly dataSource: DataSource,
  ) {
    this.logger.setContext(ProductService.name);
  }
  create(createProductDto: CreateProductDto) {
    return this.dataSource.transaction(async (manager) => {
      const handle = createHandle(createProductDto?.handle || createProductDto.title);
      const exists = await manager.findOne(Product, { where: { handle } });
      if (exists) {
        throw new ConflictException('The handle already exists!');
      }
      const hasOnlyDefaultVariant = !createProductDto?.options?.length;
      const options = !hasOnlyDefaultVariant
        ? createProductDto.options.map((option, optionIndex) => ({
            ...option,
            position: optionIndex,
            values: option.values.map((optionValue, optionValueIndex) => ({
              ...optionValue,
              position: optionValueIndex,
            })),
          }))
        : [];
      const newProduct = manager.create(Product, {
        handle,
        title: createProductDto.title,
        descriptionHtml: createProductDto?.descriptionHtml || null,
        vendor: createProductDto?.vendor || null,
        productType: createProductDto?.productType || null,
        tags: createProductDto?.tags || [],
        metafields: createProductDto?.metafields || {},
        seo: createProductDto?.seo || {},
        hasOnlyDefaultVariant,
        images: createProductDto.images.map((item, index) => ({
          ...item,
          position: index,
          isPrimary: index === 0,
        })),
        options,
      });
      await manager.save(newProduct);
      if (hasOnlyDefaultVariant) {
        const defaultVariant = manager.create(ProductVariant, {
          productId: newProduct.id,
          title: createProductDto.title,
          sku: createProductDto?.sku || createSKU(createProductDto.title),
          barcode: createProductDto?.barcode || null,
          price: createProductDto.price,
          compareAtPrice: createProductDto?.compareAtPrice || createProductDto.price,
          stockQuantity: createProductDto?.stockQuantity || 0,
          lowStockThreshold: createProductDto?.lowStockThreshold || 0,
          imageId: newProduct.images?.[0]?.id || null,
        });
        await manager.save(defaultVariant);
      } else {
        // Saving Options
        const valueMap = new Map<string, ProductOptionValue>();
        for (let i = 0; i < options.length; i++) {
          const option = await manager.save(
            manager.create(ProductOption, {
              productId: newProduct.id,
              name: options[i].name,
              type: options[i]?.type || OptionType.TEXT,
              position: i,
            }),
          );
          for (
            let optionValueIndex = 0;
            optionValueIndex < options[i].values.length;
            optionValueIndex++
          ) {
            const optionValueDto = options[i].values[optionValueIndex];
            const optionValue = await manager.save(
              manager.create(ProductOptionValue, {
                value: optionValueDto.value,
                optionId: option.id,
                position: optionValueIndex,
              }),
            );
            valueMap.set(`${option.name}|${optionValueDto.value}`, optionValue);
          }
        }
      }
      return manager.findOne(Product, {
        where: { id: newProduct.id },
        relations: {
          options: true,
          variants: true,
          images: true,
        },
      });
    });
  }

  async findAll(query: GetProductsDto) {
    const { page, limit, search, status, sortBy, sortOrder, tag, vendor } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Product> | FindOptionsWhere<Product>[] = {};
    where.status = status;
    if (vendor) where.vendor = vendor;
    // tags là string[] trong postgres
    if (tag) where.tags = Raw((alias) => `${alias} @> ARRAY[:...tag]::text[]`, { tag: [tag] });
    let finalWhere: FindOptionsWhere<Product> | FindOptionsWhere<Product>[];
    if (search) {
      finalWhere = [
        { ...where, title: ILike(`%${search}%`) },
        { ...where, handle: ILike(`%${search}%`) },
      ];
    } else finalWhere = where;
    const selectColumns = includeColumns(this.productRepository, [
      'id',
      'title',
      'handle',
      'createdAt',
      'vendor',
      'productType',
      'tags',
      'status',
      'hasOnlyDefaultVariant',
    ]);
    const [data, count] = await this.productRepository.findAndCount({
      take: limit,
      skip,
      relations: {
        images: true,
        variants: true,
      },
      where: finalWhere,
      order: sortBy === 'price' ? { variants: { price: sortOrder } } : { [sortBy]: sortOrder },
      select: {
        ...selectColumns,
        images: {
          url: true,
          alt: true,
          isPrimary: true,
        },
        variants: {
          id: true,
          title: true,
          price: true,
          compareAtPrice: true,
          sku: true,
          stockQuantity: true,
        },
      },
    });

    return {
      data: data.map(({ variants, ...rest }) => ({
        ...rest,
        variantDefault: variants[0],
      })),
      total: count,
    };
  }

  async findById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        images: true,
        options: {
          values: true,
        },
        variants: {
          image: true,
          optionValues: true,
        },
        reviews: {
          images: true,
        },
      },
      order: {
        images: {
          position: 'ASC',
        },
        options: {
          position: 'ASC',
          values: { position: 'ASC' },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found!');
    product.defaultVariant = product.variants[0];
    if (product.hasOnlyDefaultVariant) delete product.variants;
    return product;
  }

  findOne(id: string) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
