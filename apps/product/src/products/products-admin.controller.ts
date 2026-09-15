import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Admin Products')
@Controller('admin/products')
export class ProductAdminController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch('id')
  update(@Param('id') id: string, dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
