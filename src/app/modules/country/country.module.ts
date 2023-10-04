import { Module } from "@nestjs/common";
import { CountryController } from "./country.controller";
import { CountryService } from "./country.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Country } from "./country.entity";
import { Region } from "../region/region.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, Region])
  ],
  controllers: [CountryController],
  providers: [CountryService]
})
export class CountryModule {
}
