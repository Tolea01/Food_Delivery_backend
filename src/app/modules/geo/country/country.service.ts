import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Country } from "./entities/country.entity";
import { DeleteResult, EntityManager, Repository, SelectQueryBuilder, UpdateResult } from "typeorm";
import { CreateCountryDto } from "./dto/create-country.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";
import { GeoQueryResult, UpdatedCountryFields } from "../../../interfaces/interfaces";
import appError from "../../../config/appError";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private readonly countryRepository: Repository<Country>,
    private readonly entityManager: EntityManager
  ) {
  }

  async create(createCountryData: CreateCountryDto): Promise<Country> {
    return this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Country | undefined> => {
      const existCountry: Country | undefined = await transactionalEntityManager.findOne(Country,
        {
          where: createCountryData
        });

      if (existCountry) {
        throw new BadRequestException(appError.COUNTRY_EXIST);
      } else {
        return await transactionalEntityManager.save(Country, createCountryData);
      }

    });
  }

  async getAllCountries(sortBy?: string, name?: string): Promise<GeoQueryResult[]> {
    let queryBuilder: SelectQueryBuilder<Country> = await this.countryRepository.createQueryBuilder("country");

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

  async getCountryById(id: number): Promise<Country | undefined> {
    const country: Country = await this.countryRepository.findOne({ where: { id } });

    if (!country) throw new NotFoundException(appError.COUNTRY_NOT_FOUND);

    return country;
  }

  async updateCountry(id: number, updateCountry: UpdateCountryDto): Promise<UpdatedCountryFields> {
    return this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<UpdatedCountryFields> => {
      const country: Country = await this.getCountryById(id);
      const updatedFields: Partial<Country> = {};

      if (updateCountry.name_en) {
        updatedFields.name_en = updateCountry.name_en;
      }

      if (updateCountry.name_ro) {
        updatedFields.name_ro = updateCountry.name_ro;
      }

      if (updateCountry.name_ru) {
        updatedFields.name_ru = updateCountry.name_ru;
      }

      const updateResult: UpdateResult = await transactionalEntityManager.update(Country, id, updatedFields);

      return updatedFields;
    });
  }

  async deleteCountry(id: number): Promise<void> {
    return this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      const deleteCountry: DeleteResult = await transactionalEntityManager.delete(Country, id);
    });
  }

}
