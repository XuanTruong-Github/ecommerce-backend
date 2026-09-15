import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProductsService } from './products.service';

@ApiTags('Storefront Products')
@Controller('products')
export class ProductStorefrontController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.productsService.findAll(query);
  }

  @Get(':handle')
  findByHandle(@Param('handle') handle: string) {
    return this.productsService.findByHandle(handle);
  }
}