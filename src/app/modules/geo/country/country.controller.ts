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
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { Country } from './entities/country.entity';
import { UpdateCountryDto } from './dto/update-country.dto';
import { GeoQueryResult } from '@app/interfaces/interfaces';
import { LanguageHeader } from '@app/helpers/language-header';
import { QueryApiOperation } from '@app/helpers/query-api-operation';
import { ParamsApiOperation } from '@app/helpers/params-api-operation';

@ApiTags('Country CRUD')
@ApiBearerAuth()
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post('create')
  @LanguageHeader()
  @ApiOperation({ summary: 'Create a new Country' })
  async create(@Body() createCountryData: CreateCountryDto): Promise<Country> {
    return await this.countryService.create(createCountryData);
  }

  @Get('list')
  @LanguageHeader()
  @ParamsApiOperation('country')
  @QueryApiOperation('name')
  @QueryApiOperation('sortBy')
  @QueryApiOperation('sortOrder')
  async getAllCountries(
    @Req() request: Request,
    @Query('sortBy') sortBy: string,
    @Query('name') name: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC',
  ): Promise<GeoQueryResult[]> {
    return await this.countryService.getAllCountries(
      request.headers['language'],
      sortBy,
      name,
      sortOrder,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get country by id' })
  async getCountryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Country | undefined> {
    return await this.countryService.getCountryById(id);
  }

  @Patch(':id')
  @LanguageHeader()
  @ApiOperation({ summary: 'Update country by id' })
  async updateCountry(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCountry: UpdateCountryDto,
  ): Promise<Partial<Country>> {
    return await this.countryService.updateCountry(id, updateCountry);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete country by id' })
  async deleteCountry(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.countryService.deleteCountry(id);
  }
}
