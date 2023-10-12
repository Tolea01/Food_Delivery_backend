import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Region } from "./entities/region.entity";
import { EntityManager, Repository } from "typeorm";
import { CreateRegionDto } from "./dto/create-region.dto";

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region) private readonly regionRepository: Repository<Region>,
    private readonly entityManager: EntityManager
  ) {
  }

  async create(createRegionData: CreateRegionDto): Promise<Region> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const existRegion: Region = await transactionalEntityManager.findOne(Region,
        {
          where: createRegionData
        });

      if (existRegion) {
        return;
      } else {
        return await transactionalEntityManager.save(Region, createRegionData);
      }
    });
  }
}
