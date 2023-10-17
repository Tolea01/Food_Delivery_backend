import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { OrderCoCustomerService } from "./order_co_customer.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { OrderCoCustomer } from "./entities/order_co_customer.entity";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { UpdateCustomerFields } from "../../interfaces/interfaces";

@ApiTags("OrderCoCustomer CRUD")
@ApiBearerAuth()
@Controller("order-co-customer")
export class OrderCoCustomerController {
  constructor(private readonly orderCoCustomerService: OrderCoCustomerService) {
  }

  @Post("create")
  @ApiOperation({ summary: "Create a new Customer" })
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<OrderCoCustomer> {
    return await this.orderCoCustomerService.create(createCustomerDto);
  }

  @Get("by-id/:id")
  @ApiOperation({ summary: "Get country by id" })
  async getCustomerById(@Param("id", ParseIntPipe) id: number): Promise<OrderCoCustomer> {
    return await this.orderCoCustomerService.getCustomerById(id);
  };

  @Get("list")
  @ApiOperation({
    summary: "Get customer by params",
    description: "If parameters are not specified, all customers will be returned"
  })
  @ApiQuery({ name: "name", required: false })
  async getAllCustomers(@Query("name") name?: string): Promise<OrderCoCustomer[]> {
    return await this.orderCoCustomerService.getAllCustomers(name);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update customer by id" })
  async updateCustomer(@Body() updateCustomerDto: UpdateCustomerDto, @Param("id", ParseIntPipe) id: number): Promise<UpdateCustomerFields> {
    return this.orderCoCustomerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete customer by id" })
  async removeCustomer(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.orderCoCustomerService.removeCustomer(id);
  }
}
