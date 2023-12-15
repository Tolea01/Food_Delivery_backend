import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { paginationConfig } from '../../config';
import { ParamsApiOperation } from '@app/helpers/params-api-operation';
import { QueryApiOperation } from '@app/helpers/query-api-operation';
import { Order } from './entities/order.entity';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { LanguageHeader } from '@app/helpers/language-header';
import { CreateOrderResponseDto } from '@modules/order/dto/create-order.response.dto';
import { OrderItemDto } from '@modules/order/dto/order.item.dto';

@ApiTags('Order CRUD')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @Post('create')
  @LanguageHeader()
  @ApiOperation({ summary: 'Create a new order' })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request,
  ): Promise<CreateOrderResponseDto> {
    return await this.ordersService.createOrder(createOrderDto, req.user);
  }

  @Get('list')
  @LanguageHeader()
  @ParamsApiOperation('orders')
  @QueryApiOperation('pageSize')
  @QueryApiOperation('page')
  @QueryApiOperation('sortBy')
  @QueryApiOperation('orderBy')
  async findAll(
    @Query('sortBy') sortBy: string, //todo try to create DTO for query params with optional values
    @Query('orderBy', new DefaultValuePipe(paginationConfig.sortOrder))
    orderBy: 'ASC' | 'DESC',
    @Query('number') number: string,
    @Query('status') status: string,
    @Query('deliveryMethod') deliveryMethod: string,
    @Query('deliveryLocation') deliveryLocation: string,
    @Query('deliveryAddress') deliveryAddress: string,
    @Query('contactPhone') contactPhone: string,
    @Query('contactEmail') contactEmail: string,
    @Query('paymentMethod') paymentMethod: string,
    @Query('joinCode') joinCode: string,
    @Query('page', new DefaultValuePipe(paginationConfig.page), ParseIntPipe)
    page: number,
    @Query('pageSize', new DefaultValuePipe(paginationConfig.limit), ParseIntPipe)
    pageSize: number,
  ): Promise<Order[]> {
    return await this.ordersService.findAll(
      sortBy,
      orderBy,
      number,
      status,
      deliveryMethod,
      deliveryLocation,
      deliveryAddress,
      contactPhone,
      contactEmail,
      paymentMethod,
      joinCode,
      page,
      pageSize,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderItemDto> {
    return await this.ordersService.findOne(id);
  }

  @Patch(':id')
  @LanguageHeader()
  @ApiOperation({ summary: 'Update order by id' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: Request,
  ): Promise<UpdateOrderDto> {
    return await this.ordersService.update(id, updateOrderDto, req.user);
  }

  @Delete('deleted-by/:id')
  @ApiOperation({ summary: 'Complete the deleted_by field' })
  async deletedBy(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<void> {
    return await this.ordersService.softDelete(id, req.user);
  }

  @Delete('delete-values/:id')
  @ApiOperation({ summary: "Remove values 'deleted_by & deleted_at'" })
  async removeDeleteValues(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.ordersService.restoreDeletedValues(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by id' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.ordersService.remove(id);
  }
}
