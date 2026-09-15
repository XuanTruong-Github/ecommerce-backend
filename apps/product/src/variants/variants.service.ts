import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Variant, VariantDocument } from './schemas/variant.schema';
import { RabbitMQService } from '@app/messaging';
import { CreateVariantDto } from './dto/create-variant.dto';
import { PRODUCT_EVENTS } from '@app/contracts';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class VariantsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    @InjectModel(Variant.name)
    private readonly variantModel: Model<VariantDocument>,

    private readonly rabbitmq: RabbitMQService,
  ) {}

  private validateOptionValues(
    product: ProductDocument,
    optionValues: Array<{ name: string; value: string }>,
  ) {
    if (!product.options?.length) return;
    const optionNames = product.options.map((item) => item.name);
    const variantOptionNames = optionValues.map((item) => item.name);
    const missingOptions = optionNames.filter(
      (name) => !variantOptionNames.includes(name),
    );
    if (missingOptions.length) {
      throw new BadRequestException(
        `Variant is missing options: ${missingOptions.join(', ')}`,
      );
    }
    for (const optionValue of optionValues) {
      const productOption = product.options.find(
        (option) => option.name === optionValue.name,
      );

      if (!productOption) {
        throw new BadRequestException(
          `Option ${optionValue.name} does not exist in product`,
        );
      }

      if (!productOption.values.includes(optionValue.value)) {
        throw new BadRequestException(
          `Value ${optionValue.value} does not exist in option ${optionValue.name}`,
        );
      }
    }
  }

  private async recalculateProductVariantSummary(productId: string) {
    const result = await this.variantModel.aggregate([
      {
        $match: {
          productId: new Types.ObjectId(productId),
          status: 'active',
        },
      },
      {
        $group: {
          _id: null,
          min: {
            $min: '$price.amount',
          },
          max: {
            $max: '$price.amount',
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    const summary = result[0];

    await this.productModel.findByIdAndUpdate(productId, {
      minPrice: summary?.min || 0,
      maxPrice: summary?.max || 0,
      availableForSale: summary?.count > 0,
    });
  }

  async create(productId: string, dto: CreateVariantDto) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    this.validateOptionValues(product, dto.optionValues);
    const variant = await this.variantModel.create({
      ...dto,
      productId: new Types.ObjectId(productId),
    });
    await this.recalculateProductVariantSummary(variant.productId.toString());
    await this.rabbitmq.publish(PRODUCT_EVENTS.productUpdated, {
      productId,
      occurredAt: new Date().toISOString(),
    });
    await this.rabbitmq.publish(PRODUCT_EVENTS.variantCreated, {
      productId,
      variantId: variant._id.toString(),
      occurredAt: new Date().toISOString(),
    });
    return variant;
  }

  async update(id: string, dto: UpdateVariantDto) {
    const variant = await this.variantModel.findById(id);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    const product = await this.productModel.findById(variant.productId);
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    if (dto.optionValues) {
      this.validateOptionValues(product, dto.optionValues);
    }
    const updated = await this.variantModel
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .lean();

    if (!updated) {
      throw new NotFoundException('Variant not found');
    }
    await this.recalculateProductVariantSummary(variant.productId.toString());

    await this.rabbitmq.publish(PRODUCT_EVENTS.variantUpdated, {
      productId: variant.productId.toString(),
      variantId: variant._id.toString(),
      occurredAt: new Date().toISOString(),
    });
    await this.rabbitmq.publish(PRODUCT_EVENTS.productUpdated, {
      productId: variant.productId.toString(),
      occurredAt: new Date().toISOString(),
    });
    return updated;
  }

  async remove(id: string) {
    const variant = await this.variantModel.findById(id);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    await this.variantModel.findByIdAndDelete(id);
    await this.recalculateProductVariantSummary(variant.productId.toString());
    await this.rabbitmq.publish(PRODUCT_EVENTS.variantDeleted, {
      variantId: variant._id.toString(),
      productId: variant.productId.toString(),
      occurredAt: new Date().toISOString(),
    });
    await this.rabbitmq.publish(PRODUCT_EVENTS.productUpdated, {
      productId: variant.productId.toString(),
      occurredAt: new Date().toISOString(),
    });
    return { success: true };
  }

  async findByProduct(productId: string) {
    const variants = await this.variantModel.find({
      productId: new Types.ObjectId(productId),
    });
    if (!variants) throw new NotFoundException('Variants not found!');

    return variants;
  }
}
