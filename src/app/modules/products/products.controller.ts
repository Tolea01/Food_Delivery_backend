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
  ParseIntPipe, Req
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { paginationConfig } from "../../config";
import { Request } from "express";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {
  }

  @Post("create")
  @ApiOperation({ summary: "Create a new product" })
  async create(@Body() createProductDto: CreateProductDto, @Req() req: Request): Promise<Product> {
    return await this.productsService.create(createProductDto, req.user);
  }

  @Get("list")
  @ApiOperation({
    summary: "Get products by params",
    description: "This route returns a list of all products, or products specified by parameters"
  })
  @ApiQuery({ name: "pageSize", required: false })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "sortBy", required: false })
  @ApiQuery({ name: "orderBy", required: false })
  @ApiQuery({ name: "name", required: false })
  @ApiQuery({ name: "price", required: false })
  @ApiQuery({ name: "minPrice", required: false })
  @ApiQuery({ name: "maxPrice", required: false })
  async findAll(
    @Query(
      "sortBy"
    ) sortBy: string,
    @Query(
      "name"
    ) name: string,
    @Query(
      "price",
      // ParseIntPipe
    ) price: number,
    @Query(
      "minPrice",
      // ParseIntPipe
    ) minPrice: number,
    @Query(
      "maxPrice",
      // ParseIntPipe
    ) maxPrice: number,
    @Query(
      "orderBy",
      new DefaultValuePipe(paginationConfig.sortOrder)
    ) orderBy: "ASC" | "DESC",
    @Query(
      "page",
      new DefaultValuePipe(paginationConfig.page),
      // ParseIntPipe
    ) page: number,
    @Query(
      "pageSize",
      new DefaultValuePipe(paginationConfig.itemsPerPage),
      // ParseIntPipe
    ) pageSize: number
  ): Promise<Product[]> {
    return await this.productsService.findAll(
      sortBy,
      name,
      price,
      minPrice,
      maxPrice,
      orderBy,
      page,
      pageSize
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by id" })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Product | undefined> {
    return await this.productsService.findOne(id);
  }

  @Get("by-category/:id")
  @ApiOperation({ summary: "Get product by categoryId" })
  async getProductsByCategory(@Param("id", ParseIntPipe) id: number): Promise<Product[] | undefined> {
    return await this.productsService.getProductsByCategory(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update product by id" })
  async update(@Param("id") id: string, @Body() updateProductDto: Partial<Product>, @Req() req: Request): Promise<Partial<Product>> {
    return await this.productsService.update(+id, updateProductDto, req.user);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete product by id" })
  async remove(@Param("id") id: string, @Req() req: Request): Promise<void> {
    return await this.productsService.remove(+id, req.user);
  }
}