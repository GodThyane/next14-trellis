import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
   expanded: Record<string, any>;
   setExpanded: (id: string) => void;
}

export const useUIStore = create<State>()(
   persist(
      (set) => ({
         expanded: {},
         setExpanded: (id: string) => {
            set((state) => ({
               expanded: {
                  ...state.expanded,
                  [id]: !state.expanded[id],
               },
            }));
         },
      }),
      {
         name: 'accordion-storage',
      }
   )
);
