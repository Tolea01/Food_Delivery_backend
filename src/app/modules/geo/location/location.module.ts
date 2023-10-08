import { Module } from "@nestjs/common";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Location } from "./entities/location.entity";
import { Region } from "../region/entities/region.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Region])
  ],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule {
}