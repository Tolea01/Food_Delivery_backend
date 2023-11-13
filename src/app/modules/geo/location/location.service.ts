import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { RegionService } from '@region/region.service';
import appError from '@config/appError';
import { GeoQueryResult } from '@app/interfaces/interfaces';
import { UpdateLocationDto } from './dto/update-location.dto';
import handleExceptionError from '@app/helpers/handle-exception-error';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    private readonly regionService: RegionService,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createLocationData: CreateLocationDto): Promise<Location> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<Location> => {
          const existLocation: Location | undefined =
            await this.locationRepository.findOne({ where: createLocationData });

          if (existLocation) {
            throw new BadRequestException(appError.LOCATION_EXIST);
          } else {
            await this.regionService.getRegionById(createLocationData.region_id);
            return await transactionalEntityManager.save(Location, createLocationData);
          }
        },
      );
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async getAllLocations(
    language: string,
    name?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<GeoQueryResult[]> {
    try {
      if (name || sortBy || sortOrder) {
        const queryBuilder: SelectQueryBuilder<Location> =
          await this.locationRepository.createQueryBuilder('location');

        queryBuilder
          .where(name ? `location.name_${language} = :name` : '1=1', { name })
          .orderBy(sortBy ? `location.${sortBy}` : '1=1', sortOrder || 'ASC')
          .select(sortBy ? [`location.id`, `location.${sortBy}`] : null);

        const locations: Location[] = await queryBuilder.getMany();

        return locations.map((location: Location) => ({
          id: location.id,
          [sortBy]: location[sortBy],
        }));
      } else {
        return await this.locationRepository.find();
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    try {
      return await this.locationRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getLocationsByRegion(regionId: number): Promise<Location[]> {
    try {
      await this.regionService.getRegionById(regionId);

      return await this.locationRepository.find({
        where: {
          region_id: regionId,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateLocation(
    id: number,
    updateLocationData: UpdateLocationDto,
  ): Promise<Partial<Location>> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<Partial<Location>> => {
          await this.getLocationById(id);

          if (updateLocationData.region_id) {
            await this.regionService.getRegionById(updateLocationData.region_id);
          }

          await transactionalEntityManager.update(Location, id, updateLocationData);
          return updateLocationData;
        },
      );
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async removeLocation(id: number): Promise<void> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<void> => {
          await transactionalEntityManager.delete(Location, id);
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
