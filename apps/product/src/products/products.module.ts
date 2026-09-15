import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductAdminController } from './products-admin.controller';
import { ProductStorefrontController } from './products-storefront.controller';

@Module({
  controllers: [ProductAdminController, ProductStorefrontController],
  providers: [ProductsService],
})
export class ProductsModule {}
