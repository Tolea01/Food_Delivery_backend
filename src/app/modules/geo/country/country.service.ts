import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Country } from "./entities/country.entity";
import { DeleteResult, EntityManager, Repository } from "typeorm";
import { CreateGeoDto } from "../dto/create-geo.dto";
import appError from "../../../config/appError";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private readonly countryRepository: Repository<Country>,
    private readonly entityManager: EntityManager
  ) {
  }

  private countryProps(country: CreateGeoDto) {
    return {
      name_en: country.name_en,
      name_ro: country.name_ro,
      name_ru: country.name_ru
    };
  }

  async create(createCountryData: CreateGeoDto): Promise<Country> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const existCountry: Country = await transactionalEntityManager.findOne(Country,
        {
          where: this.countryProps(createCountryData)
        });

      if (existCountry) throw new BadRequestException(appError.COUNTRY_EXIST);

      return await transactionalEntityManager.save(Country, this.countryProps(createCountryData));
    });
  }

  async getAllCountries(sortBy?: string, name?: string) {
    let queryBuilder = await this.countryRepository.createQueryBuilder("country");

    if (name) {
      queryBuilder = queryBuilder.where(
        "country.name_en = :name OR country.name_ro = :name OR country.name_ru = :name",
        { name }
      );

      return await queryBuilder.getMany();
    }

    if (sortBy) {
      queryBuilder = queryBuilder.orderBy(`country.${sortBy}`, "ASC");
      queryBuilder = queryBuilder.select([`country.id`, `country.${sortBy}`]);

      const countries: Country[] = await queryBuilder.getMany();

      return countries.map((country: Country) => ({
        id: country.id,
        [sortBy]: country[sortBy]
      }));
    }

    return await this.countryRepository.find();
  }

  async deleteCountry(id: number): Promise<void> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const deleteCountry: DeleteResult = await transactionalEntityManager.delete(Country, id);
    });
  }

}
