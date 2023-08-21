import { create } from "zustand";

// Определим структуру состояния, которое будет управляться с помощью "zustand"
interface useProModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

// "create" - функция из Zustand для создания ханилища состояния. Эта функция принимает аргументом функцию, которая задает начальное состояние и методы для его обновления.
export const useProModal = create<useProModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
