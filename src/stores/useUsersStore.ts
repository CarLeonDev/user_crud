import { User } from '@/types/users';
import { create } from 'zustand'

interface UsersStore {
  usersAdded: User[];
  usersDeleted: string[];
  setUsersAdded: (newUsers: User[]) => void;
  setUsersDeleted: (userIds: string[]) => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
  usersAdded: [],
  usersDeleted: [],
  setUsersAdded: (newUsers: User[]) => set({ usersAdded: newUsers }),
  setUsersDeleted: (userIds: string[]) => set({ usersDeleted: userIds }),
}))