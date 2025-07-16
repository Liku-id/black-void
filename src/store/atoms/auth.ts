import { atom } from 'jotai';

// Types
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
}

// Base atoms
export const registerFormAtom = atom<RegisterFormData>({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phoneNumber: '',
});
