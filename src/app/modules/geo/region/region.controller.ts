import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegionService } from "./region.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { Region } from "./entities/region.entity";

@ApiTags("Region CRUD")
@ApiBearerAuth()
@Controller("region")
export class RegionController {
  constructor(private readonly regionService: RegionService) {
  }

  @Post("create")
  @ApiOperation({
    summary: "Create a new Region",
    description: "The request body should contain an object named \"createRegionData\""
  })
  async create(@Body() createRegionData: CreateRegionDto): Promise<Region> {
    return await this.regionService.create(createRegionData);
  }
}
