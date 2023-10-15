import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Location } from "./entities/location.entity";
import { DeleteResult, EntityManager, Repository, UpdateResult } from "typeorm";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { RegionService } from "../region/region.service";
import { Region } from "../region/entities/region.entity";

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    private readonly regionService: RegionService,
    private readonly entityManager: EntityManager
  ) {
  }

  async create(createLocationData: CreateLocationDto): Promise<Location> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const { name_en, name_ro, name_ru, region_id } = createLocationData;
      const existLocation: Location | undefined = await transactionalEntityManager.findOne(Location,
        {
          where: { name_en, name_ro, name_ru, region_id: { id: region_id } }
        });

      if (existLocation) {
        return;
      } else {
        const region: Region = await this.regionService.getRegionById(region_id);

        if (!region) throw new NotFoundException();

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

  async getAllLocations(name?: string, sortBy?: string): Promise<any> {
    let querybuilder = await this.locationRepository.createQueryBuilder("location");

    if (name) {
      querybuilder = querybuilder.where(
        "location.name_en = :name OR location.name_ro = :name OR location.name_ru = :name",
        { name }
      );

      return await querybuilder.getMany();
    }

    if (sortBy) {
      querybuilder = querybuilder.orderBy(`location.${sortBy}`, "ASC");
      querybuilder = querybuilder.select([`location.id`, `location.${sortBy}`]);

      const locations: Location[] = await querybuilder.getMany();

      return locations.map(location => ({
        id: location.id,
        [sortBy]: location[sortBy]
      }));
    }
    return await this.locationRepository.find();
  }

  async getLocationById(id: number): Promise<Location> {
    return await this.locationRepository.findOne({ where: { id } });
  }

  async getLocationsByRegion(regionId: number): Promise<Location[]> {
    const region: Region = await this.regionService.getRegionById(regionId);

    if (!region) throw new NotFoundException();

    return await this.locationRepository.find({
      where: {
        region_id: { id: regionId }
      }
    });
  }

  async updateLocation(id: number, updateLocationData: UpdateLocationDto): Promise<UpdateResult> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const location: Location = await this.getLocationById(id);
      const updatedFields: Partial<Location> = {};

      if (!location) throw new NotFoundException();

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

      return await transactionalEntityManager.update(Location, id, updatedFields);

    });
  }

  async removeLocation(id: number): Promise<DeleteResult> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      return transactionalEntityManager.delete(Location, id);
    });
  }

}
