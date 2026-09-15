import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@ApiTags('Admin Variants')
@Controller('admin')
export class VariantAdminController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post('products/:id/variants')
  create(@Param('id') productId: string, @Body() dto: CreateVariantDto) {
    return this.variantsService.create(productId, dto);
  }

  @Get('products/:id/variants')
  findByProduct(@Param('id') productId: string) {
    return this.variantsService.findByProduct(productId);
  }

  @Patch('variants/:id')
  update(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.variantsService.update(id, dto);
  }

  @Delete('variants/:id')
  remove(@Param('id') id: string) {
    return this.variantsService.remove(id);
  }
}
