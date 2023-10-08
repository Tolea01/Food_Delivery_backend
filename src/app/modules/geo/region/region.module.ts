import { Module } from "@nestjs/common";
import { RegionController } from "./region.controller";
import { RegionService } from "./region.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Region } from "./entities/region.entity";
import { Country } from "../country/entities/country.entity";
import { Location } from "../location/entities/location.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Region, Country, Location])
  ],
  controllers: [RegionController],
  providers: [RegionService]
})
export class RegionModule {
}