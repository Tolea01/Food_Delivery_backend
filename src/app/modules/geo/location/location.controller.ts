import { Body, Controller, Patch } from "@nestjs/common";
import { LocationService } from "./location.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateLocationDto } from "./dto/create-location.dto";
import { Location } from "./entities/location.entity";

@ApiTags("Location CRUD")
@ApiBearerAuth()
@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService) {
  }

  @Patch("create")
  @ApiOperation({
    summary: "Create a new Location",
    description: "The request body should contain an object named \"createLocationData\""
  })
  async create(@Body() createlocationData: CreateLocationDto): Promise<Location> {
    return this.locationService.create(createlocationData);
  }

}
