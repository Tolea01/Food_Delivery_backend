import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Location } from "./entities/location.entity";
import { EntityManager, Repository, SelectQueryBuilder } from "typeorm";
import { CreateLocationDto } from "./dto/create-location.dto";
import { RegionService } from "../region/region.service";
import { Region } from "../region/entities/region.entity";
import appError from "../../../config/appError";
import { GeoQueryResult } from "../../../interfaces/interfaces";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    private readonly regionService: RegionService,
    private readonly entityManager: EntityManager
  ) {
  }

  async create(createLocationData: CreateLocationDto): Promise<Location | undefined> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Location> => {
      const { name_en, name_ro, name_ru, region_id } = createLocationData;
      const existLocation: Location | undefined = await transactionalEntityManager.findOne(Location,
        {
          where: { name_en, name_ro, name_ru, region_id: { id: region_id } }
        });

      if (existLocation) {
        throw new BadRequestException(appError.LOCATION_EXIST);
      } else {
        const region: Region | undefined = await this.regionService.getRegionById(region_id);
        const location: Location = this.entityManager.create(Location, {
          name_en,
          name_ru,
          name_ro,
          region_id: region
        });

        return await transactionalEntityManager.save(Location, location);
      }
    });
  }

  async getAllLocations(language: string, name?: string, sortBy?: string, sortOrder?: "ASC" | "DESC"): Promise<GeoQueryResult[]> {
    if (name || sortBy || sortOrder) {
      const queryBuilder: SelectQueryBuilder<Location> = await this.locationRepository.createQueryBuilder("location");

      queryBuilder
        .where(name ? `location.name_${language} = :name` : "1=1", { name })
        .orderBy(sortBy ? `location.${sortBy}` : "1=1", sortOrder || "ASC")
        .select(sortBy ? [`location.id`, `location.${sortBy}`] : null);

      const locations: Location[] = await queryBuilder.getMany();

      return locations.map((location: Location) => ({
        id: location.id,
        [sortBy]: location[sortBy]
      }));
    } else {
      return await this.locationRepository.find();
    }
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    const location: Location | undefined = await this.locationRepository.findOne({ where: { id } });

    if (!location) throw new NotFoundException(appError.LOCATION_NOT_FOUND);

    return location;
  }

  async getLocationsByRegion(regionId: number): Promise<Location[]> {
    await this.regionService.getRegionById(regionId);

    return await this.locationRepository.find({
      where: {
        region_id: { id: regionId }
      }
    });
  }

  async updateLocation(id: number, updateLocationData: UpdateLocationDto): Promise<Partial<Location>> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Partial<Location>> => {
      await this.getLocationById(id);

      await transactionalEntityManager.update(Location, id, updateLocationData);

      return updateLocationData;
    });
  }

  async removeLocation(id: number): Promise<void> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      await transactionalEntityManager.delete(Location, id);
    });
  }
}
