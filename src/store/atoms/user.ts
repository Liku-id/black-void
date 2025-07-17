import { atom } from 'jotai';

// Types
export interface UserData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

// Base atoms
export const userDataAtom = atom<UserData>({
  id: '',
  fullName: '',
  email: '',
  phoneNumber: '',
});
