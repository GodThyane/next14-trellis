import { create } from 'zustand';

interface State {
   id?: string;
   isOpen: boolean;
   onOpen: (id: string) => void;
   onClose: () => void;
}

export const useCardModalStore = create<State>()((set) => ({
   id: undefined,
   isOpen: false,
   onOpen: (id: string) => set({ isOpen: true, id }),
   onClose: () => set({ isOpen: false, id: undefined }),
}));
