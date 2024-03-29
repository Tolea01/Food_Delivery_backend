import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { GeoQueryResult } from '@app/interfaces/interfaces';
import appError from '@config/appError';
import handleExceptionError from '@app/helpers/handle-exception-error';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private readonly countryRepository: Repository<Country>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createCountryData: CreateCountryDto): Promise<Country> {
    try {
      return await this.entityManager.transaction(
        async (
          transactionalEntityManager: EntityManager,
        ): Promise<Country | undefined> => {
          const existCountry: Country | undefined =
            await transactionalEntityManager.findOne(Country, {
              where: createCountryData,
            });

          if (existCountry) {
            throw new BadRequestException(appError.COUNTRY_EXIST);
          } else {
            return await transactionalEntityManager.save(Country, createCountryData);
          }
        },
      );
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async getAllCountries(
    language: string,
    sortBy?: string,
    name?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<GeoQueryResult[]> {
    try {
      if (name || sortBy || sortOrder) {
        const queryBuilder: SelectQueryBuilder<Country> =
          await this.countryRepository.createQueryBuilder('country');

        queryBuilder
          .where(name ? `country.name_${language} = :name` : '1=1', { name })
          .orderBy(sortBy ? `country.${sortBy}` : '1=1', sortOrder || 'ASC')
          .select(sortBy ? [`country.id`, `country.${sortBy}`] : null);

        const countries: Country[] = await queryBuilder.getMany();

        return countries.map((country: Country) => ({
          id: country.id,
          [sortBy]: country[sortBy],
        }));
      } else {
        return await this.countryRepository.find();
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCountryById(id: number): Promise<Country | undefined> {
    try {
      return await this.countryRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateCountry(
    id: number,
    updateCountry: UpdateCountryDto,
  ): Promise<Partial<Country>> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<Partial<Country>> => {
          await this.getCountryById(id);
          await transactionalEntityManager.update(Country, id, updateCountry);
          return updateCountry;
        },
      );
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async deleteCountry(id: number): Promise<void> {
    try {
      return this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<void> => {
          await transactionalEntityManager.delete(Country, id);
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
