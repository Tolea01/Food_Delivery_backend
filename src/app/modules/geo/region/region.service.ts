import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Region } from "./entities/region.entity";
import { EntityManager, Repository } from "typeorm";
import { CreateRegionDto } from "./dto/create-region.dto";
import { CountryService } from "../country/country.service";
import { Country } from "../country/entities/country.entity";

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region) private readonly regionRepository: Repository<Region>,
    private readonly entityManager: EntityManager,
    private readonly countryService: CountryService
  ) {
  }

  async create(createRegionData: CreateRegionDto): Promise<Region | undefined> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const { name_en, name_ro, name_ru, country_id } = createRegionData;
      const existRegion: Region | undefined = await transactionalEntityManager.findOne(Region, {
        where: { name_en, name_ro, name_ru, country_id: { id: country_id } }
      });

      if (existRegion) {
        return undefined;
      } else {
        const country: Country = await this.countryService.getCountryById(country_id);

        if (!country) throw new NotFoundException();

        const region: Region = this.entityManager.create(Region, {
          name_en,
          name_ro,
          name_ru,
          country_id: country
        });

        return await transactionalEntityManager.save(Region, region);
      }
    });
  }
}
