import { z } from 'zod';
import { CreateBoardSchema } from '@/actions/board/board.schema';

export const CreateCardSchema = z
   .object({
      listId: z.string(),
   })
   .merge(CreateBoardSchema);

export const UpdateCardSchema = z.object({
   boardId: z.string(),
   title: z.optional(
      z.string().min(3, {
         message: 'El título debe tener al menos 3 caracteres',
      })
   ),
   description: z.optional(
      z.string().min(3, {
         message: 'La descripción debe tener al menos 3 caracteres',
      })
   ),
   id: z.string(),
});

export const CopyCardSchema = z.object({
   id: z.string(),
   boardId: z.string(),
});

export const DeleteCardSchema = z.object({}).merge(CopyCardSchema);
