import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { RegionService } from "./region.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { Region } from "./entities/region.entity";
import { Country } from "../country/entities/country.entity";
import { GeoQueryResult } from "../../../helpers/interfaces";
import { UpdateCountryDto } from "../country/dto/update-country.dto";
import { DeleteResult, UpdateResult } from "typeorm";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { Location } from "../location/entities/location.entity";

@ApiTags("Region CRUD")
@ApiBearerAuth()
@Controller("region")
export class RegionController {
  constructor(private readonly regionService: RegionService) {
  }

  @Post("create")
  @ApiOperation({
    summary: "Create a new Region",
    description: "The request body should contain an object named \"createRegionData\""
  })
  async create(@Body() createRegionData: CreateRegionDto): Promise<Region | undefined> {
    return await this.regionService.create(createRegionData);
  }

  @Get("list")
  @ApiOperation({
    summary: "Get region by param",
    description: "If parameters are not specified, all regions will be returned"
  })
  @ApiQuery({ name: "name", required: false })
  @ApiQuery({ name: "sortBy", required: false })
  async getAllRegions(@Query("sortBy") sortBy?: string, @Query("name") name?: string): Promise<GeoQueryResult[]> {
    return this.regionService.getAllRegions(sortBy, name);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get region by id" })
  async getRegionById(@Param("id", ParseIntPipe) id: number): Promise<Region> {
    return await this.regionService.getRegionById(id);
  }

  @Get("by-country/:countryId")
  @ApiOperation({ summary: "Get region by countryId" })
  async getRegionsByCountry(@Param("countryId", ParseIntPipe) countryId: number): Promise<Region[]> {
    return this.regionService.getRegionsByCountry(countryId);
  };

  @Patch(":id")
  @ApiOperation({
    summary: "Update region by id",
    description: "This route allows updating a field by id"
  })
  async updateRegion(@Param("id", ParseIntPipe) id: number, @Body() updateRegion: UpdateRegionDto): Promise<UpdateResult> {
    return this.regionService.updateRegion(id, updateRegion);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete region by id" })
  async deleteCountry(@Param("id", ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.regionService.removeRegion(id);
  }
}
