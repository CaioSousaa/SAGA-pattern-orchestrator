import z from 'zod';

const createActionSchemaDTO = z.object({
  name_action: z.string(),
  saga_id: z.string(),
});

type CreateActionSchemaDTO = z.infer<typeof createActionSchemaDTO>;

export { CreateActionSchemaDTO, createActionSchemaDTO };
