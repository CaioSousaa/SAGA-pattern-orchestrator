import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateOrderService,
  IRequest,
  IResponse,
} from 'src/modules/saga/services/CreateOrder.service';

@Controller('order')
export class SagaController {
  constructor(private readonly createOrderService: CreateOrderService) {}

  @Post()
  public async createOrderSaga(@Body() data: IRequest): Promise<IResponse> {
    return this.createOrderService.execute(data);
  }
}
