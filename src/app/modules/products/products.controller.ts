import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { paginationConfig } from '../../config';
import { Request } from 'express';
import { UpdateProductDto } from './dto/update-product.dto';
import { LanguageHeader } from '@app/helpers/language-header';
import { ParamsApiOperation } from '@app/helpers/params-api-operation';
import { QueryApiOperation } from '@app/helpers/query-api-operation';

@ApiBearerAuth()
@ApiTags('Product CRUD')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @LanguageHeader()
  @ApiOperation({ summary: 'Create a new product' })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
  ): Promise<Product> {
    return await this.productsService.create(createProductDto, req.user);
  }

  @Get('list')
  @LanguageHeader()
  @ParamsApiOperation('products')
  @QueryApiOperation('pageSize')
  @QueryApiOperation('page')
  @QueryApiOperation('sortBy')
  @QueryApiOperation('orderBy')
  @QueryApiOperation('name')
  @QueryApiOperation('maxPrice')
  @QueryApiOperation('minPrice')
  async findAll(
    @Req() request: Request,
    @Query('sortBy') sortBy: string,
    @Query('name') name: string,
    @Query('maxPrice') maxPrice: number,
    @Query('minPrice') minPrice: number,
    @Query('orderBy', new DefaultValuePipe(paginationConfig.sortOrder))
    orderBy: 'ASC' | 'DESC',
    @Query('page', new DefaultValuePipe(paginationConfig.page), ParseIntPipe)
    page: number,
    @Query('pageSize', new DefaultValuePipe(paginationConfig.itemsPerPage), ParseIntPipe)
    pageSize: number,
  ): Promise<Product[]> {
    return await this.productsService.findAll(
      request.headers['language'],
      sortBy,
      name,
      maxPrice,
      minPrice,
      orderBy,
      page,
      pageSize,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product | undefined> {
    return await this.productsService.findOne(id);
  }

  @Get('by-category/:id')
  @ApiOperation({ summary: 'Get product by categoryId' })
  async getProductsByCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product[] | undefined> {
    return await this.productsService.getProductsByCategory(id);
  }

  @Patch(':id')
  @LanguageHeader()
  @ApiOperation({ summary: 'Update product by id' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
  ): Promise<Partial<Product>> {
    return await this.productsService.update(id, updateProductDto, req.user);
  }

  @Delete('deleted-by/:id')
  @ApiOperation({ summary: 'Complete the deleted_by field' })
  async deletedBy(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<void> {
    return await this.productsService.deletedBy(id, req.user);
  }

  @Delete('delete-values/:id')
  @ApiOperation({ summary: "Remove values 'deleted_by & deleted_at'" })
  async removeDeleteValues(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.productsService.removeDeleteValues(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by id' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.productsService.deleteProduct(id);
  }
}
