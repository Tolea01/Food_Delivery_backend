import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, SelectQueryBuilder } from "typeorm";
import { ProductCategory } from "./entities/product-category.entity";
import appError from "../../config/appError";
import { ProductCategoryQueryResult } from "../../interfaces/interfaces";

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory) private readonly productCategoryRepository: Repository<ProductCategory>,
    private readonly entityManager: EntityManager
  ) {
  }

  async create(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<ProductCategory> => {
      const existProductCategory: ProductCategory = await this.entityManager.findOne(ProductCategory, {
        where: createProductCategoryDto
      });

      if (existProductCategory) {
        throw new BadRequestException(appError.PRODUCT_CATEGORY_EXIST);
      } else {
        return await transactionalEntityManager.save(ProductCategory, createProductCategoryDto);
      }

    });
  }

  async getAllProductCategories(language: string, name?: string, sortBy?: string, sortOrder?: "ASC" | "DESC"): Promise<ProductCategoryQueryResult[]> {
    if (name || sortBy || sortOrder) {
      const queryBuilder: SelectQueryBuilder<ProductCategory> = await this.productCategoryRepository.createQueryBuilder("product_category");

      queryBuilder
        .where(name ? `product_category.name_${language} = :name` : "1=1", { name })
        .orderBy(sortBy ? `product_category.${sortBy}` : "1=1", sortOrder || "ASC")
        .select(sortBy ? [`product_category.id`, `product_category.${sortBy}`] : null);

      const productCategories: ProductCategory[] = await queryBuilder.getMany();

      return productCategories.map((productCategory: ProductCategory) => ({
        id: productCategory.id,
        [sortBy]: productCategory[sortBy]
      }));
    } else {
      return await this.productCategoryRepository.find();
    }
  }


  async getProductCategoryById(id: number): Promise<ProductCategory> {
    const productCategory: ProductCategory = await this.productCategoryRepository.findOne({ where: { id } });

    if (!productCategory) throw new BadRequestException(appError.PRODUCT_CATEGORY_NOT_FOUND);

    return productCategory;
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto): Promise<Partial<ProductCategory>> {
    return this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Partial<ProductCategory>> => {
      await this.getProductCategoryById(id);
      await transactionalEntityManager.update(ProductCategory, id, updateProductCategoryDto);

      return updateProductCategoryDto;
    });
  }

  async remove(id: number): Promise<void> {
    return this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      await transactionalEntityManager.delete(ProductCategory, id);
    });
  }
}
