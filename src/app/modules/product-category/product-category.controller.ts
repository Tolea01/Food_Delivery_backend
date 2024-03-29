import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductCategory } from './entities/product-category.entity';
import { ProductCategoryQueryResult } from '@app/interfaces/interfaces';
import { LanguageHeader } from '@app/helpers/language-header';
import { ParamsApiOperation } from '@app/helpers/params-api-operation';
import { QueryApiOperation } from '@app/helpers/query-api-operation';

@ApiTags('Product Category CRUD')
@ApiBearerAuth()
@Controller('product-category')
export class ProductCategoryController {
  constructor(private readonly productCategoriesService: ProductCategoryService) {}

  @Post('create')
  @LanguageHeader()
  @ApiOperation({ summary: 'Create a new product category' })
  async create(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    return await this.productCategoriesService.create(createProductCategoryDto);
  }

  @Get('list')
  @LanguageHeader()
  @ParamsApiOperation('product category')
  @QueryApiOperation('name')
  @QueryApiOperation('sortBy')
  async findAll(
    @Req() request: Request,
    @Query('name') name: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC',
  ): Promise<ProductCategoryQueryResult[]> {
    return await this.productCategoriesService.getAllProductCategories(
      request.headers['language'],
      name,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product category by id' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductCategory> {
    return await this.productCategoriesService.getProductCategoryById(id);
  }

  @Patch(':id')
  @LanguageHeader()
  @ApiOperation({ summary: 'Update product category by id' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<Partial<ProductCategory>> {
    return await this.productCategoriesService.update(id, updateProductCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product category by id' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.productCategoriesService.remove(id);
  }
}
