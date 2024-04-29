'use client';

import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { CardWithList } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AlignLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateCardSchema } from '@/actions/card/card.schema';
import { UpdateCardFormValues } from '@/components/modals/card-modal/header';
import { useParams } from 'next/navigation';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import FormTextarea from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import { updateCard } from '@/actions/card/update-card.action';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
   data: CardWithList;
}

const Description = ({ data }: Props) => {
   const params = useParams();
   const queryClient = useQueryClient();

   const boardId = params.id;

   const [description, setDescription] = useState(data.description);
   const [isEditing, setIsEditing] = useState(false);

   const formRef = useRef<ElementRef<'form'>>(null);

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
      setValue,
   } = useForm<UpdateCardFormValues>({
      resolver: zodResolver(UpdateCardSchema),
      defaultValues: {
         description: data.description ?? '',
         boardId: '',
         id: data.id,
      },
   });

   const enableEditing = () => {
      setIsEditing(true);
   };

   const disableEditing = (reset = false) => {
      setIsEditing(false);
      if (reset) {
         setValue('description', data.description ?? '');
      }
   };

   const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
         disableEditing();
      }
   };

   useEventListener('keydown', onKeyDown);
   useOnClickOutside(formRef, () => disableEditing(true));

   const onSubmit = async (values: UpdateCardFormValues) => {
      if (description === values.description) return;

      const { ok, message, data } = await updateCard(values);
      if (ok && data) {
         await queryClient.invalidateQueries({
            queryKey: ['card', data.id],
         });

         await queryClient.invalidateQueries({
            queryKey: ['card-logs', data.id],
         });
         setDescription(data.description);
         toast.success(message);
         disableEditing();
      } else {
         toast.error(message);
      }
   };

   useEffect(() => {
      reset({
         description: data.description ?? '',
         id: data.id,
         boardId: boardId as string,
      });
   }, [boardId, data.description, data.id, reset]);

   return (
      <div className={'flex items-start gap-x-3 w-full'}>
         <AlignLeft size={20} className={'mt-0.5 text-neutral-700'} />
         <div className="w-full">
            <p className={'font-semibold text-neutral-700 mb-2'}>Descripción</p>
            {isEditing ? (
               <form
                  onSubmit={handleSubmit(onSubmit)}
                  ref={formRef}
                  className={'space-y-2'}
               >
                  <FormTextarea
                     name={'description'}
                     register={register}
                     error={errors.description}
                     autofocus
                     className={'w-full mt-2'}
                     placeholder={'Añade una descripción más detallada...'}
                     pending={isSubmitting}
                  />
                  <div className={'flex items-center gap-x-2'}>
                     <Button
                        type={'submit'}
                        size={'sm'}
                        variant={'primary'}
                        disabled={isSubmitting}
                     >
                        Guardar
                     </Button>
                     <Button
                        type={'button'}
                        size={'sm'}
                        variant={'ghost'}
                        onClick={() => disableEditing(true)}
                        disabled={isSubmitting}
                     >
                        Cancelar
                     </Button>
                  </div>
               </form>
            ) : (
               <div
                  role={'button'}
                  onClick={enableEditing}
                  className={
                     'min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md'
                  }
               >
                  {data.description ?? 'Añade una descripción más detallada...'}
               </div>
            )}
         </div>
      </div>
   );
};

export default Description;

const DescriptionSkeleton = () => {
   return (
      <div className={'flex items-start gap-x-3 w-full'}>
         <Skeleton className={'h-6 w-6 bg-neutral-200'} />
         <div className="w-full">
            <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
            <Skeleton className="w-full h-[78px] mb-2 bg-neutral-200" />
         </div>
      </div>
   );
};

Description.Skeleton = DescriptionSkeleton;
