import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, EntityManager, Repository, SelectQueryBuilder, UpdateResult } from "typeorm";
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

  async getAllProductCategories(name?: string, sortBy?: string): Promise<ProductCategoryQueryResult[]> {
    let queryBuilder: SelectQueryBuilder<ProductCategory> = await this.productCategoryRepository.createQueryBuilder("product_category");

    if (name) {
      queryBuilder = queryBuilder.where(
        "product_category.name_en = :name OR product_category.name_ro = :name OR product_category.name_ru = :name",
        { name }
      );

      return await queryBuilder.getMany();
    }

    if (sortBy) {
      queryBuilder = queryBuilder.orderBy(`product_category.${sortBy}`, "ASC");
      queryBuilder = queryBuilder.select([`product_category.id`, `product_category.${sortBy}`]);

      const productCategories: ProductCategory[] = await queryBuilder.getMany();

      return productCategories.map((productCategory: ProductCategory) => ({
        id: productCategory.id,
        [sortBy]: productCategory[sortBy]
      }));
    }

    return await this.productCategoryRepository.find();
  }


  async getProductCategoryById(id: number): Promise<ProductCategory> {
    const productCategory: ProductCategory = await this.productCategoryRepository.findOne({ where: { id } });

    if (!productCategory) throw new BadRequestException(appError.PRODUCT_CATEGORY_NOT_FOUND);

    return productCategory;
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto): Promise<Partial<ProductCategory>> {
    return this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Partial<ProductCategory>> => {
      const productCategory: ProductCategory = await this.getProductCategoryById(id);
      const updatedFields: Partial<ProductCategory> = {};

      for (const updateProductCategoryKey in updateProductCategoryDto) {
        if (updateProductCategoryDto[updateProductCategoryKey]) {
          updatedFields[updateProductCategoryKey] = updateProductCategoryDto[updateProductCategoryKey];
        }
      }

      const updateProductCategory: UpdateResult = await transactionalEntityManager.update(ProductCategory, id, updatedFields);

      return updatedFields;
    });
  }

  async remove(id: number): Promise<void> {
    return this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      const removeProductCategory: DeleteResult = await transactionalEntityManager.delete(ProductCategory, id);
    });
  }
}
