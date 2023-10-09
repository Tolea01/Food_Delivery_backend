import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Location } from "./entities/location.entity";
import { EntityManager, Repository } from "typeorm";
import { CreateLocationDto } from "./dto/create-location.dto";

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
}
