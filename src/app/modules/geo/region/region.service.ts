import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateRegionDto } from './dto/create-region.dto';
import { CountryService } from '@country/country.service';
import { UpdateRegionDto } from './dto/update-region.dto';
import { GeoQueryResult } from '@app/interfaces/interfaces';
import appError from '@config/appError';
import handleExceptionError from '@app/helpers/handle-exception-error';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region) private readonly regionRepository: Repository<Region>,
    private readonly entityManager: EntityManager,
    private readonly countryService: CountryService,
  ) {}

  async create(createRegionData: CreateRegionDto): Promise<Region | undefined> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<Region> => {
          const existRegion: Region | undefined = await this.regionRepository.findOne({
            where: createRegionData,
          });

          if (existRegion) {
            throw new BadRequestException(appError.REGION_EXIST);
          } else {
            await this.countryService.getCountryById(createRegionData.country_id);
            return await transactionalEntityManager.save(Region, createRegionData);
          }
        },
      );
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async getAllRegions(
    language: string,
    sortBy?: string,
    name?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<GeoQueryResult[]> {
    try {
      if (name || sortBy || sortOrder) {
        const queryBuilder: SelectQueryBuilder<Region> =
          await this.regionRepository.createQueryBuilder('region');

        queryBuilder
          .where(name ? `region.name_${language} = :name` : '1=1', { name })
          .orderBy(sortBy ? `region.${sortBy}` : '1=1', sortOrder || 'ASC')
          .select(sortBy ? [`region.id`, `region.${sortBy}`] : null);

        const regions: Region[] = await queryBuilder.getMany();

        return regions.map((region: Region) => ({
          id: region.id,
          [sortBy]: region[sortBy],
        }));
      } else {
        return await this.regionRepository.find();
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getRegionById(id: number): Promise<Region | undefined> {
    try {
      return await this.regionRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getRegionsByCountry(countryId: number): Promise<Region[] | undefined> {
    try {
      await this.countryService.getCountryById(countryId);

      return await this.regionRepository.find({
        where: {
          country_id: countryId,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateRegion(
    id: number,
    updateRegionData: UpdateRegionDto,
  ): Promise<Partial<Region>> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<Partial<Region>> => {
          await this.getRegionById(id);

          if (updateRegionData.country_id) {
            await this.countryService.getCountryById(updateRegionData.country_id);
          }

          await transactionalEntityManager.update(Region, id, updateRegionData);
          return updateRegionData;
        },
      );
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async removeRegion(id: number): Promise<void> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<void> => {
          await transactionalEntityManager.delete(Region, id);
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
