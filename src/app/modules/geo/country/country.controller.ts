import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CountryService } from "./country.service";
import { CreateGeoDto } from "../dto/create-geo.dto";
import { Country } from "./entities/country.entity";

@ApiTags("Country CRUD")
@ApiBearerAuth()
@Controller("country")
export class CountryController {
  constructor(private readonly countryService: CountryService) {
  }

  @Post("create")
  @ApiOperation({
    summary: "Create a new Country",
    description: "The request body should contain an object named \"createCountryData\""
  })
  async create(@Body() createCountryData: CreateGeoDto): Promise<Country> {
    return await this.countryService.create(createCountryData);
  }

  @Get("list")
  @ApiOperation({
    summary: "Get country by params",
    description: "If parameters are not specified, all countries will be returned"
  })
  @ApiQuery({ name: "name", required: false })
  @ApiQuery({ name: "sortBy", required: false })
  async getAllCountries(@Query("sortBy") sortBy?: string, @Query("name") name?: string) {
    return this.countryService.getAllCountries(sortBy, name);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete country by id" })
  async deleteCountry(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.countryService.deleteCountry(id);
  }
}
