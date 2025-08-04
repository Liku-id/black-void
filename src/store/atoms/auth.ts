import { atom } from 'jotai';

// Types
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
}

// Register form atom for multi-step registration
export const registerFormAtom = atom<RegisterFormData>({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phoneNumber: '',
});
