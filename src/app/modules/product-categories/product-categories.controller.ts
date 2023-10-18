import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from "@nestjs/common";
import { ProductCategoriesService } from "./product-categories.service";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProductCategory } from "./entities/product-category.entity";
import { ProductCategoryQueryResult } from "../../interfaces/interfaces";

@ApiTags("Product Category CRUD")
@ApiBearerAuth()
@Controller("product-category")
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) {
  }

  @Post("create")
  @ApiOperation({ summary: "Create a new product category" })
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
    return await this.productCategoriesService.create(createProductCategoryDto);
  }

  @Get("list")
  @ApiOperation({
    summary: "Get country by params",
    description: "If parameters are not specified, all countries will be returned"
  })
  @ApiQuery({ name: "name", required: false })
  @ApiQuery({ name: "sortBy", required: false })
  async findAll(@Query("name") name?: string, @Query("sortBy") sortBy?: string): Promise<ProductCategoryQueryResult[]> {
    return await this.productCategoriesService.getAllProductCategories(name, sortBy);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product category by id" })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<ProductCategory> {
    return await this.productCategoriesService.getProductCategoryById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update product category by id" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateProductCategoryDto: UpdateProductCategoryDto): Promise<Partial<ProductCategory>> {
    return await this.productCategoriesService.update(id, updateProductCategoryDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete product category by id" })
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.productCategoriesService.remove(id);
  }
}
