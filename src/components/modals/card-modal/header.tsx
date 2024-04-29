'use client';

import React, { useEffect, useState } from 'react';
import { CardWithList } from '@/types';
import { Layout } from 'lucide-react';
import FormInput from '@/components/form/form-input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateCardSchema } from '@/actions/card/card.schema';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { updateCard } from '@/actions/card/update-card.action';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export type UpdateCardFormValues = {
   id: string;
   title?: string;
   boardId: string;
   description?: string;
};

interface HeaderProps {
   data: CardWithList;
}

const Header = ({ data }: HeaderProps) => {
   const params = useParams();
   const queryClient = useQueryClient();

   const boardId = params.id;
   const [title, setTitle] = useState(data.title);

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
   } = useForm<UpdateCardFormValues>({
      resolver: zodResolver(UpdateCardSchema),
      defaultValues: {
         title: data.title,
         boardId: '',
         id: data.id,
      },
   });

   useEffect(() => {
      reset({
         title: data.title,
         boardId: boardId as string,
         id: data.id,
      });
   }, [boardId, data.id, data.title, reset]);

   const onBlur = () => {
      handleSubmit(onSubmit)();
   };

   const onSubmit = async (values: UpdateCardFormValues) => {
      if (title === values.title) return;
      const { ok, message, data } = await updateCard(values);

      if (ok && data) {
         await queryClient.invalidateQueries({
            queryKey: ['card', data.id],
         });

         await queryClient.invalidateQueries({
            queryKey: ['card-logs', data.id],
         });
         setTitle(data.title);
         toast.success(message);
      } else {
         toast.error(message);
      }
   };

   return (
      <div className={'flex items-start gap-x-3 mb-6 w-full'}>
         <Layout size={20} className={'mt-1 text-neutral-700'} />
         <div className={'w-full'}>
            <form onSubmit={handleSubmit(onSubmit)}>
               <FormInput
                  type={'text'}
                  name={'title'}
                  register={register}
                  error={errors.title}
                  className={
                     'font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate'
                  }
                  id={'title'}
                  onBlur={onBlur}
                  pending={isSubmitting}
               />
            </form>
            <p className={'text-sm text-muted-foreground'}>
               en lista <span className={'underline'}>{data.list.title}</span>
            </p>
         </div>
      </div>
   );
};

export default Header;

const HeaderSkeleton = () => {
   return (
      <div className="fex items-start gap-x-3 mb-6">
         <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
         <div>
            <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
            <Skeleton className="w-12 h-4 bg-neutral-200" />
         </div>
      </div>
   );
};

Header.Skeleton = HeaderSkeleton;
