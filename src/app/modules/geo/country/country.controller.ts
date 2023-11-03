import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CountryService } from "./country.service";
import { CreateCountryDto } from "./dto/create-country.dto";
import { Country } from "./entities/country.entity";
import { UpdateCountryDto } from "./dto/update-country.dto";
import { GeoQueryResult } from "../../../interfaces/interfaces";

@ApiTags("Country CRUD")
@ApiBearerAuth()
@Controller("country")
export class CountryController {
  constructor(private readonly countryService: CountryService) {
  }

  @Post("create")
  @ApiOperation({ summary: "Create a new Country" })
  async create(@Body() createCountryData: CreateCountryDto): Promise<Country> {
    return await this.countryService.create(createCountryData);
  }

  @Get("list")
  @ApiOperation({
    summary: "Get country by params",
    description: "If parameters are not specified, all countries will be returned"
  })
  @ApiQuery({ name: "name", required: false })
  @ApiQuery({ name: "sortBy", required: false })
  async getAllCountries(
    @Req() request: Request,
    @Query("sortBy") sortBy: string, @Query("name") name: string, @Query("sortOrder") sortOrder: "ASC" | "DESC"
  ): Promise<GeoQueryResult[]> {
    return await this.countryService.getAllCountries(request.headers["language"], sortBy, name, sortOrder);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get country by id" })
  async getCountryById(@Param("id", ParseIntPipe) id: number): Promise<Country | undefined> {
    return await this.countryService.getCountryById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update country by id" })
  async updateCountry(@Param("id", ParseIntPipe) id: number, @Body() updateCountry: UpdateCountryDto): Promise<Partial<Country>> {
    return await this.countryService.updateCountry(id, updateCountry);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete country by id" })
  async deleteCountry(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.countryService.deleteCountry(id);
  }
}
