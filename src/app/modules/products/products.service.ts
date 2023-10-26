import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { EntityManager, Repository, SelectQueryBuilder } from "typeorm";
import appError from "../../config/appError";
import { User } from "../user/entities/user.entity";
import { ProductCategoriesService } from "../product-categories/product-categories.service";
import { ProductCategory } from "../product-categories/entities/product-category.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly entityManager: EntityManager,
    private readonly productCategoryService: ProductCategoriesService
  ) {
  }

  async create(createProductDto: CreateProductDto, user: Partial<User>): Promise<Product> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Product> => {
      const {
        name_en, name_ro, name_ru, description_en, description_ro,
        description_ru, photo, price, category_id
      } = createProductDto;
      const existProduct: Product | undefined = await transactionalEntityManager.findOne(Product, {
        where: {
          name_en,
          name_ro,
          name_ru,
          description_en,
          description_ro,
          description_ru,
          photo,
          price,
          category_id: { id: category_id }
        }
      });

      if (existProduct) {
        throw new BadRequestException(appError.PRODUCT_EXIST);
      } else {
        const productCategory: ProductCategory | undefined = await this.productCategoryService.getProductCategoryById(category_id);
        const product: Product = this.entityManager.create(Product, {
          name_en,
          name_ro,
          name_ru,
          description_en,
          description_ro,
          description_ru,
          photo,
          price,
          category_id: productCategory,
          created_by: { id: user.id }
        });

        return await transactionalEntityManager.save(Product, product);
      }
    });
  }

  async findAll(
    sortBy?: string,
    name?: string,
    price?: number,
    maxPrice?: number,
    minPrice?: number,
    orderBy?: "ASC" | "DESC",
    page?: number,
    pageSize?: number
  ): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.productRepository.createQueryBuilder("product");

    if (sortBy) {
      switch (sortBy) {
        case "name":
          queryBuilder.addOrderBy("product.name_en", orderBy || "ASC");
          queryBuilder.addOrderBy("product.name_ro", orderBy || "ASC");
          queryBuilder.addOrderBy("product.name_ru", orderBy || "ASC");
          break;
        case "price":
          queryBuilder.orderBy("product.price", orderBy || "ASC");
          break;
        case "created_at":
          queryBuilder.orderBy("product.created_at", orderBy || "DESC");
          break;
        default:
          queryBuilder.orderBy("product.created_at", "DESC");
          break;
      }
    }

    if (name) {
      queryBuilder.where(
        "product.name_en = :name OR product.name_ro = :name OR product.name_ru = :name",
        { name }
      );
    }

    if (price) {
      queryBuilder.andWhere("product.price = :price", { price });
    }

    if (maxPrice) {
      queryBuilder.andWhere("product.price >= :maxPrice", { maxPrice });
    }

    if (minPrice) {
      queryBuilder.andWhere("product.price <= :minPrice", { minPrice });
    }

    if (page && pageSize) {
      const skip: number = (page - 1) * pageSize;
      queryBuilder.skip(skip).take(pageSize);
    }

    queryBuilder.andWhere("(product.deleted_by IS NULL AND product.deleted_at IS NULL)");

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Product | undefined> {
    const product: Product | undefined = await this.productRepository.findOne({ where: { id } });

    if (!product) throw new NotFoundException(appError.PRODUCT_NOT_FOUND);

    return product;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[] | undefined> {
    await this.productCategoryService.getProductCategoryById(categoryId);

    return await this.productRepository.find({
      where: {
        category_id: { id: categoryId }
      }
    });
  }

  async update(id: number, updateProductDto: Partial<Product>, user: any): Promise<Partial<Product>> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Partial<Product>> => {
      try {
        const product: Product | undefined = await this.findOne(id);

        updateProductDto.updated_by = user.id;

        await transactionalEntityManager.update(Product, id, updateProductDto);

        return updateProductDto;
      } catch (error) {
        return error
      }
    });
  }

  async remove(id: number, user: any): Promise<void> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      try {
        const product: Product | undefined = await this.findOne(id);

        product.deleted_by = user.id;
        product.deleted_at = new Date();

        await transactionalEntityManager.save(Product, product);

      } catch (error) {
        return error;
      }
    });
  }
}