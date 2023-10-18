import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Region } from "./entities/region.entity";
import { DeleteResult, EntityManager, Repository, SelectQueryBuilder, UpdateResult } from "typeorm";
import { CreateRegionDto } from "./dto/create-region.dto";
import { CountryService } from "../country/country.service";
import { Country } from "../country/entities/country.entity";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { GeoQueryResult } from "../../../interfaces/interfaces";
import appError from "../../../config/appError";

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region) private readonly regionRepository: Repository<Region>,
    private readonly entityManager: EntityManager,
    private readonly countryService: CountryService
  ) {
  }

  async create(createRegionData: CreateRegionDto): Promise<Region | undefined> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Region> => {
      const { name_en, name_ro, name_ru, country_id } = createRegionData;
      const existRegion: Region | undefined = await transactionalEntityManager.findOne(Region, {
        where: { name_en, name_ro, name_ru, country_id: { id: country_id } }
      });

      if (existRegion) {
        throw new BadRequestException(appError.REGION_EXIST);
      } else {
        const country: Country = await this.countryService.getCountryById(country_id);
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
    let queryBuilder: SelectQueryBuilder<Region> = await this.regionRepository.createQueryBuilder("region");

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

  async getRegionById(id: number): Promise<Region | undefined> {
    const region: Region | undefined = await this.regionRepository.findOne({ where: { id } });

    if (!region) throw new NotFoundException(appError.REGION_NOT_FOUND);

    return region;
  }

  async getRegionsByCountry(countryId: number): Promise<Region[] | undefined> {
    const country: Country = await this.countryService.getCountryById(countryId);

    return await this.regionRepository.find({
      where: {
        country_id: { id: countryId }
      }
    });
  }

  async updateRegion(id: number, updateRegionData: UpdateRegionDto): Promise<Partial<Country>> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Partial<Country>> => {
      const region: Region = await this.getRegionById(id);
      const updatedFields: Partial<Region> = {};

      for (const updateRegionKey in updateRegionData) {
        if (updateRegionData[updateRegionKey]) {
          updatedFields[updateRegionKey] = updateRegionData[updateRegionKey];
        }
      }

      if (updateRegionData.country_id) {
        const country: Country = await this.countryService.getCountryById(updateRegionData.country_id);
        updatedFields.country_id = country;
      }

      const updateRegion: UpdateResult = await transactionalEntityManager.update(Region, id, updatedFields);

      return updatedFields;

    });
  }

  async removeRegion(id: number): Promise<void> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      const removeRegion: DeleteResult = await transactionalEntityManager.delete(Region, id);
    });
  }
}
