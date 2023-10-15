import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { LocationService } from "./location.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateLocationDto } from "./dto/create-location.dto";
import { Location } from "./entities/location.entity";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { DeleteResult, UpdateResult } from "typeorm";
import { GeoQueryResult, UpdatedLocationFields } from "../../../interfaces/interfaces";

@ApiTags("Location CRUD")
@ApiBearerAuth()
@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService) {
  }

  @Post("create")
  @ApiOperation({
    summary: "Create a new Location",
    description: "The request body should contain an object named \"createLocationData\""
  })
  async create(@Body() createlocationData: CreateLocationDto): Promise<Location | undefined> {
    return await this.locationService.create(createlocationData);
  }

  @Get("list")
  @ApiOperation({
    summary: "Get location by params",
    description: "If parameters are not specified, all locations will be returned"
  })
  @ApiQuery({ name: "name", required: false })
  @ApiQuery({ name: "sortBy", required: false })
  async getAllLocations(@Query("name") name?: string, @Query("sortBy") sortBy?: string): Promise<GeoQueryResult[]> {
    return await this.locationService.getAllLocations(name, sortBy);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get location by id" })
  async getLocationById(@Param("id", ParseIntPipe) id: number): Promise<Location | undefined> {
    return await this.locationService.getLocationById(id);
  };

  @Get("by-region/:regionId")
  @ApiOperation({ summary: "Get location by regionId" })
  async getLocationsForRegion(@Param("regionId", ParseIntPipe) regionId: number): Promise<Location[]> {
    return await this.locationService.getLocationsByRegion(regionId);
  };

  @Patch(":id")
  @ApiOperation({
    summary: "Update location by id",
    description: "This route allows updating a field by id"
  })
  async updateLocation(@Param("id", ParseIntPipe) id: number, @Body() updateLocation: UpdateLocationDto): Promise<UpdatedLocationFields> {
    return await this.locationService.updateLocation(id, updateLocation);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete location by id" })
  async removeLocation(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.locationService.removeLocation(id);
  };
}
