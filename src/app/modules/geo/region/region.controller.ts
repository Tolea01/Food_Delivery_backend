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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { Region } from './entities/region.entity';
import { GeoQueryResult } from '@app/interfaces/interfaces';
import { UpdateRegionDto } from './dto/update-region.dto';
import { LanguageHeader } from '@app/helpers/language-header';
import { ParamsApiOperation } from '@app/helpers/params-api-operation';
import { QueryApiOperation } from '@app/helpers/query-api-operation';

@ApiTags('Region CRUD')
@ApiBearerAuth()
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post('create')
  @LanguageHeader()
  @ApiOperation({ summary: 'Create a new Region' })
  async create(@Body() createRegionData: CreateRegionDto): Promise<Region> {
    return await this.regionService.create(createRegionData);
  }

  @Get('list')
  @LanguageHeader()
  @ParamsApiOperation('region')
  @QueryApiOperation('name')
  @QueryApiOperation('sortBy')
  async getAllRegions(
    @Req() request: Request,
    @Query('sortBy') sortBy: string,
    @Query('name') name: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC',
  ): Promise<GeoQueryResult[]> {
    return await this.regionService.getAllRegions(
      request.headers['language'],
      sortBy,
      name,
      sortOrder,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get region by id' })
  async getRegionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Region | undefined> {
    return await this.regionService.getRegionById(id);
  }

  @Get('by-country/:countryId')
  @ApiOperation({ summary: 'Get region by countryId' })
  async getRegionsByCountry(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<Region[]> {
    return await this.regionService.getRegionsByCountry(countryId);
  }

  @Patch(':id')
  @LanguageHeader()
  @ApiOperation({ summary: 'Update region by id' })
  async updateRegion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRegion: UpdateRegionDto,
  ): Promise<Partial<Region>> {
    return await this.regionService.updateRegion(id, updateRegion);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete region by id' })
  async deleteCountry(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.regionService.removeRegion(id);
  }
}
