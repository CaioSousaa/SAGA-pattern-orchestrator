import { Status } from 'generated/prisma';
import { Actions } from './Actions';

export class Saga {
  id?: string;
  name_flow: string;
  status: Status;
  created_at: Date;
  actions?: Actions[];

  constructor({ name_flow, status, created_at }: Saga) {
    Object.assign(this, {
      name_flow,
      status,
      created_at,
    });
  }

  static create({ status, name_flow }: Saga) {
    return new Saga({
      status,
      name_flow,
      created_at: new Date(),
    });
  }
}
