import { atom } from 'jotai';

// Types
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role?: string;
}

// Register form atom for multi-step registration
export const registerFormAtom = atom<RegisterFormData>({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phoneNumber: '',
});

// User auth
export const authAtom = atom<{
  isLoggedIn: boolean | null;
  userData: UserData | null;
  loading: boolean;
}>({
  isLoggedIn: null,
  userData: null,
  loading: true,
});
