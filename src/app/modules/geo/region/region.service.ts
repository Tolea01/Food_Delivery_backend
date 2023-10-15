import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Region } from "./entities/region.entity";
import { DeleteResult, EntityManager, Repository, UpdateResult } from "typeorm";
import { CreateRegionDto } from "./dto/create-region.dto";
import { CountryService } from "../country/country.service";
import { Country } from "../country/entities/country.entity";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { GeoQueryResult } from "../../../helpers/interfaces";

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

  async getAllRegions(sortBy?: string, name?: string): Promise<GeoQueryResult[]> {
    let queryBuilder = await this.regionRepository.createQueryBuilder("region");

    if (name) {
      queryBuilder = queryBuilder.where(
        "region.name_en = :name OR region.name_ro = :name OR region.name_ru = :name",
        { name }
      );

      return await queryBuilder.getMany();
    }

    if (sortBy) {
      queryBuilder = queryBuilder.orderBy(`region.${sortBy}`, "ASC");
      queryBuilder = queryBuilder.select([`region.id`, `region.${sortBy}`]);

      const regions: Region[] = await queryBuilder.getMany();

      return regions.map((region: Region) => ({
        id: region.id,
        [sortBy]: region[sortBy]
      }));
    }

    return await this.regionRepository.find();
  }

  async getRegionById(id: number): Promise<Region> {
    return this.regionRepository.findOne({ where: { id } });
  }

  async getRegionsByCountry(countryId: number): Promise<Region[] | undefined> {
    const country: Country = await this.countryService.getCountryById(countryId);

    if (!country) throw new NotFoundException();

    return await this.regionRepository.find({
      where: {
        country_id: { id: countryId }
      }
    });
  }

  async updateRegion(id: number, updateRegionData: UpdateRegionDto): Promise<UpdateResult> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const region: Region = await this.getRegionById(id);
      const updatedFields: Partial<Region> = {};

      if (!region) throw new NotFoundException();

      if (updateRegionData.name_en) {
        updatedFields.name_en = updateRegionData.name_en;
      }

      if (updateRegionData.name_ro) {
        updatedFields.name_ro = updateRegionData.name_ro;
      }

      if (updateRegionData.name_ru) {
        updatedFields.name_ru = updateRegionData.name_ru;
      }

      if (updateRegionData.country_id) {
        const country: Country = await this.countryService.getCountryById(updateRegionData.country_id);
        updatedFields.country_id = country;
      }

      return await transactionalEntityManager.update(Region, id, updatedFields);

    });
  }

  async removeRegion(id: number): Promise<DeleteResult> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      return transactionalEntityManager.delete(Region, id);
    });
  }
}
