import { Saga } from './Saga';

export class Actions {
  id?: number;
  name_action: string;
  saga_id: string;
  saga?: Saga;
  created_at: Date;

  constructor({ name_action, saga_id, created_at }: Actions) {
    Object.assign(this, {
      name_action,
      saga_id,
      created_at,
    });
  }

  static create({ name_action, saga_id }: Actions) {
    return new Actions({
      name_action,
      saga_id,
      created_at: new Date(),
    });
  }
}
