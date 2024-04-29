import { z } from 'zod';

export const CreateBoardSchema = z.object({
   title: z.string().min(3, {
      message: 'El título debe tener al menos 3 caracteres',
   }),
});

export const DeleteBoardSchema = z.object({
   id: z.string(),
});

export const UpdateBoardSchema = z
   .object({})
   .merge(CreateBoardSchema)
   .merge(DeleteBoardSchema);
