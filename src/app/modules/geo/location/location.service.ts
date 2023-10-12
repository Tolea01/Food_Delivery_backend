import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Location } from "./entities/location.entity";
import { EntityManager, Repository } from "typeorm";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    private readonly entityManager: EntityManager
  ) {
  }

  async create(createLocationData: CreateLocationDto): Promise<Location> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const existLocation: Location = await transactionalEntityManager.findOne(Location,
        {
          where: createLocationData
        });

      if (existLocation) {
        return;
      } else {
        return await transactionalEntityManager.save(Location, createLocationData);
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
      querybuilder = querybuilder.orderBy(`location.${sortBy}, "ASC"`);
      querybuilder = querybuilder.select([`location.id, location.${sortBy}`]);

      const locations: Location[] = await querybuilder.getMany();

      return locations.map(location => ({
        id: location.id,
        [sortBy]: location[sortBy]
      }));

      return await this.locationRepository.find();
    }
  }

  async getLocationById(id: number): Promise<Location> {
    return await this.locationRepository.findOne({ where: { id } });
  }

  async getLocationsForRegion(regionId: number): Promise<Location[]> {
    return await this.locationRepository.find({
      where: {
        region_id: regionId
      }
    });
  }

  async updateLocation(id: number, updateLocationData: UpdateLocationDto) {
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

      return await transactionalEntityManager.update(Location, id, updatedFields);

    });
  }

  async removeLocation(id: number) {
    return this.entityManager.transaction(async transactionalEntityManager => {
      return transactionalEntityManager.delete(Location, id);
    });
  }

}
