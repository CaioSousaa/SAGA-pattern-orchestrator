import { Status } from 'generated/prisma';
import z from 'zod';

const createSagaSchemaDTO = z.object({
  name_flow: z.string(),
  status: z.enum(Status),
});

type CreateSagaSchemaDTO = z.infer<typeof createSagaSchemaDTO>;

export { CreateSagaSchemaDTO, createSagaSchemaDTO };
