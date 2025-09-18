import { NotAcceptableException } from '@nestjs/common';
import { IRequest } from 'src/usecases/CreateOrder.service';

export function validateRequest(data?: IRequest): IRequest {
  if (!data) {
    throw new NotAcceptableException('Request body is missing');
  }

  const requiredFields: (keyof IRequest)[] = [
    'userId',
    'productId',
    'name',
    'email',
    'balance',
    'name_product',
    'price',
    'quantity',
  ];

  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ''
    ) {
      throw new NotAcceptableException(`Field "${field}" is missing`);
    }
  }

  return data;
}
