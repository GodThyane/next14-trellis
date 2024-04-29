import { z } from 'zod';
import { CreateBoardSchema } from '@/actions/board/board.schema';

export const CreateListSchema = z
   .object({
      boardId: z.string(),
   })
   .merge(CreateBoardSchema);

export const DeleteListSchema = z.object({
   id: z.string(),
   boardId: z.string(),
});

export const CopyListSchema = z.object({}).merge(DeleteListSchema);

export const UpdateListSchema = z
   .object({
      title: z.string().min(3, {
         message: 'El título debe tener al menos 3 caracteres',
      }),
   })
   .merge(CreateListSchema)
   .merge(DeleteListSchema);
