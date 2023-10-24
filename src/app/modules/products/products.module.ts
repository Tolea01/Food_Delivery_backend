import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { UserModule } from "../user/user.module";
import { ProductCategoriesModule } from "../product-categories/product-categories.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    UserModule, ProductCategoriesModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {
}
