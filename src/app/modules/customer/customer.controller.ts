import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '@modules/customer/entities/customer.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LanguageHeader } from '@helpers/language-header';
import { Request } from 'express';
import { QueryApiOperation } from '@helpers/query-api-operation';

@ApiBearerAuth()
@ApiTags('Customer CRUD')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create')
  @LanguageHeader()
  @ApiOperation({ summary: 'Create a new customer' })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Req() request: Request,
  ): Promise<Customer> {
    return await this.customerService.create(createCustomerDto, request.user);
  }

  @Get('list')
  @QueryApiOperation('name')
  @QueryApiOperation('address')
  @QueryApiOperation('phone')
  @QueryApiOperation('email')
  @QueryApiOperation('orderBy')
  @QueryApiOperation('sortOrder')
  async findAll(
    @Query('name') name: string,
    @Query('address') address: string,
    @Query('phone') phone: string,
    @Query('email') email: string,
    @Query('orderBy') orderBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC',
  ): Promise<Customer[]> {
    return await this.customerService.findAll(
      name,
      address,
      phone,
      email,
      orderBy,
      sortOrder,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by id' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return await this.customerService.findOne(id);
  }

  @Patch(':id')
  @LanguageHeader()
  @ApiOperation({ summary: 'Update customer by id' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Partial<Customer>> {
    return await this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer by id' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.customerService.remove(id);
  }
}
