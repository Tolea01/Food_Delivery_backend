import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { EntityManager, IsNull, Repository, SelectQueryBuilder } from "typeorm";
import appError from "@config/appError";
import { User } from "@user/entities/user.entity";
import { ProductCategoriesService } from "@product-categories/product-categories.service";
import { ProductCategory } from "@product-categories/entities/product-category.entity";
import { UpdateProductDto } from "./dto/update-product.dto";

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
    language: any,
    sortBy?: string,
    name?: string,
    maxPrice?: number,
    minPrice?: number,
    orderBy?: "ASC" | "DESC",
    page?: number,
    pageSize?: number
  ): Promise<Product[]> {
    const queryBuilder: SelectQueryBuilder<Product> = await this.productRepository.createQueryBuilder("product");

    if (page && pageSize) {
      queryBuilder
        .skip((page - 1) * pageSize)
        .take(pageSize);
    }

    queryBuilder
      .orderBy(sortBy === "name" ? `product.name_${language}` : "1=1", orderBy || "ASC")
      .addOrderBy(sortBy === "price" ? "product.price" : "1=1", orderBy || "ASC")
      .addOrderBy(sortBy === "created_at" ? "product.created_at" : "1=1", orderBy || "DESC")
      .where(name ? `product.name_${language} = :name` : "1=1", { name })
      .andWhere(maxPrice ? "product.price <= :maxPrice" : "1=1", { maxPrice })
      .andWhere(minPrice ? "product.price >= :maxPrice" : "1=1", { minPrice })
      .andWhere("(product.deleted_by IS NULL AND product.deleted_at IS NULL)");

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Product | undefined> {
    const product: Product | undefined = await this.productRepository.findOne({
      where: { id, deleted_at: IsNull() }
    });

    if (!product) throw new NotFoundException(appError.PRODUCT_NOT_FOUND);

    return product;
  }

  async getOne(id: number): Promise<Product | undefined> {
    const product: Product | undefined = await this.productRepository.findOne({ where: { id } });

    if (!product) throw new NotFoundException(appError.PRODUCT_NOT_FOUND);

    return product;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[] | undefined> {
    await this.productCategoryService.getProductCategoryById(categoryId);

    return await this.productRepository.find({
      where: {
        category_id: { id: categoryId },
        deleted_at: IsNull()
      }
    });
  }

  async update(id: number, updateProductData: UpdateProductDto, user: any): Promise<Partial<Product>> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Partial<Product>> => {
      await this.findOne(id);

      updateProductData.updated_by = user.id;
      updateProductData.updated_at = new Date();

      await transactionalEntityManager.update(Product, id, updateProductData);

      return updateProductData;
    });
  }

  async deletedBy(id: number, user: any): Promise<void> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      const product: Product | undefined = await this.getOne(id);

      product.deleted_by = user.id;
      product.deleted_at = new Date();

      await transactionalEntityManager.save(Product, product);
    });
  }

  async removeDeleteValues(id: number): Promise<void> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      const product: Product | undefined = await this.getOne(id);

      product.deleted_by = null;
      product.deleted_at = null;

      await transactionalEntityManager.save(Product, product);
    });
  }

  async deleteProduct(id: number): Promise<void> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      await transactionalEntityManager.delete(Product, id);
    });
  }
}