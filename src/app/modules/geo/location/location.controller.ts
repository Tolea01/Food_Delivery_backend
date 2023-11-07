import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto } from './dto/create-location.dto';
import { Location } from './entities/location.entity';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GeoQueryResult } from '@app/interfaces/interfaces';
import { LanguageHeader } from '@app/helpers/language-header';
import { ParamsApiOperation } from '@app/helpers/params-api-operation';
import { QueryApiOperation } from '@app/helpers/query-api-operation';

@ApiTags('Location CRUD')
@ApiBearerAuth()
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('create')
  @LanguageHeader()
  @ApiOperation({ summary: 'Create a new Location' })
  async create(@Body() createlocationData: CreateLocationDto): Promise<Location> {
    return await this.locationService.create(createlocationData);
  }

  @Get('list')
  @LanguageHeader()
  @ParamsApiOperation('location')
  @QueryApiOperation('name')
  @QueryApiOperation('sortBy')
  async getAllLocations(
    @Req() request: Request,
    @Query('name') name: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ): Promise<GeoQueryResult[]> {
    return await this.locationService.getAllLocations(
      request.headers['language'],
      name,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get location by id' })
  async getLocationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Location | undefined> {
    return await this.locationService.getLocationById(id);
  }

  @Get('by-region/:regionId')
  @ApiOperation({ summary: 'Get location by regionId' })
  async getLocationsForRegion(
    @Param('regionId', ParseIntPipe) regionId: number,
  ): Promise<Location[]> {
    return await this.locationService.getLocationsByRegion(regionId);
  }

  @Patch(':id')
  @LanguageHeader()
  @ApiOperation({ summary: 'Update location by id' })
  async updateLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocation: UpdateLocationDto,
  ): Promise<Partial<Location>> {
    return await this.locationService.updateLocation(id, updateLocation);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete location by id' })
  async removeLocation(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.locationService.removeLocation(id);
  }
}
