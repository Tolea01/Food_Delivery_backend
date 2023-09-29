import { Module } from "@nestjs/common";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Location } from "./location.entity";
import { Region } from "../region/region.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Region])
  ],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule {
}
