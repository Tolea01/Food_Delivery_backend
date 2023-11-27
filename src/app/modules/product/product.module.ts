import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UserModule } from '@user/user.module';
import { ProductCategoryModule } from '@product-category/product-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UserModule, ProductCategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
