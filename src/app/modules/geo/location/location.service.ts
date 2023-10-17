import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Location } from "./entities/location.entity";
import { DeleteResult, EntityManager, Repository, SelectQueryBuilder, UpdateResult } from "typeorm";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { RegionService } from "../region/region.service";
import { Region } from "../region/entities/region.entity";
import appError from "../../../config/appError";
import { GeoQueryResult, UpdatedLocationFields } from "../../../interfaces/interfaces";

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

  async getAllLocations(name?: string, sortBy?: string): Promise<GeoQueryResult[]> {
    let queryBuilder: SelectQueryBuilder<Location> = await this.locationRepository.createQueryBuilder("location");

    if (name) {
      queryBuilder = queryBuilder.where(
        "location.name_en = :name OR location.name_ro = :name OR location.name_ru = :name",
        { name }
      );

      return await queryBuilder.getMany();
    }

    if (sortBy) {
      queryBuilder = queryBuilder.orderBy(`location.${sortBy}`, "ASC");
      queryBuilder = queryBuilder.select([`location.id`, `location.${sortBy}`]);

      const locations: Location[] = await queryBuilder.getMany();

      return locations.map((location: Location) => ({
        id: location.id,
        [sortBy]: location[sortBy]
      }));
    }
    return await this.locationRepository.find();
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    const location: Location | undefined = await this.locationRepository.findOne({ where: { id } });

    if (!location) throw new NotFoundException(appError.LOCATION_NOT_FOUND);

    return location;
  }

  async getLocationsByRegion(regionId: number): Promise<Location[]> {
    const region: Region | undefined = await this.regionService.getRegionById(regionId);

    return await this.locationRepository.find({
      where: {
        region_id: { id: regionId }
      }
    });
  }

  async updateLocation(id: number, updateLocationData: UpdateLocationDto): Promise<UpdatedLocationFields> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<UpdatedLocationFields> => {
      const location: Location | undefined = await this.getLocationById(id);
      const updatedFields: Partial<Location> = {};

      if (updateLocationData.name_en) {
        updatedFields.name_en = updateLocationData.name_en;
      }

      if (updateLocationData.name_ro) {
        updatedFields.name_ro = updateLocationData.name_ro;
      }

      if (updateLocationData.name_ru) {
        updatedFields.name_ru = updateLocationData.name_ru;
      }

      if (updateLocationData.region_id) {
        const region: Region = await this.regionService.getRegionById(updateLocationData.region_id);
        updatedFields.region_id = region;
      }

      const updateResult: UpdateResult = await transactionalEntityManager.update(Location, id, updatedFields);

      return updatedFields;

    });
  }

  async removeLocation(id: number): Promise<void> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      const deleteLocation: DeleteResult = await transactionalEntityManager.delete(Location, id);
    });
  }

}
