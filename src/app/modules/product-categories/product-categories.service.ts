import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';
import appError from '@config/appError';
import { ProductCategoryQueryResult } from '@app/interfaces/interfaces';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<ProductCategory> => {
          const existProductCategory: ProductCategory = await this.entityManager.findOne(
            ProductCategory,
            {
              where: createProductCategoryDto,
            },
          );

          if (existProductCategory) {
            throw new BadRequestException(appError.PRODUCT_CATEGORY_EXIST);
          } else {
            return await transactionalEntityManager.save(
              ProductCategory,
              createProductCategoryDto,
            );
          }
        },
      );
    } catch (error) {
      return error.message;
    }
  }

  async getAllProductCategories(
    language: string,
    name?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<ProductCategoryQueryResult[]> {
    try {
      if (name || sortBy || sortOrder) {
        const queryBuilder: SelectQueryBuilder<ProductCategory> =
          await this.productCategoryRepository.createQueryBuilder('product_category');

        queryBuilder
          .where(name ? `product_category.name_${language} = :name` : '1=1', { name })
          .orderBy(sortBy ? `product_category.${sortBy}` : '1=1', sortOrder || 'ASC')
          .select(sortBy ? [`product_category.id`, `product_category.${sortBy}`] : null);

        const productCategories: ProductCategory[] = await queryBuilder.getMany();

        return productCategories.map((productCategory: ProductCategory) => ({
          id: productCategory.id,
          [sortBy]: productCategory[sortBy],
        }));
      } else {
        return await this.productCategoryRepository.find();
      }
    } catch (error) {
      return error.message;
    }
  }

  async getProductCategoryById(id: number): Promise<ProductCategory> {
    try {
      return await this.productCategoryRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      return error.message;
    }
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<Partial<ProductCategory>> {
    try {
      return this.entityManager.transaction(
        async (
          transactionalEntityManager: EntityManager,
        ): Promise<Partial<ProductCategory>> => {
          await this.getProductCategoryById(id);
          await transactionalEntityManager.update(
            ProductCategory,
            id,
            updateProductCategoryDto,
          );

          return updateProductCategoryDto;
        },
      );
    } catch (error) {
      return error.message;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      return this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<void> => {
          await transactionalEntityManager.delete(ProductCategory, id);
        },
      );
    } catch (error) {
      return error.message;
    }
  }
}
