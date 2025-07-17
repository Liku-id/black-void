import { atom } from 'jotai';
import axios from 'axios';

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

export const authAtom = atom<boolean | null>(null);

export const fetchAuthAtom = atom(
  (get) => get(authAtom),
  async (_get, set) => {
    try {
      const response = await axios.get('/api/auth/me');
      set(authAtom, response.data.loggedIn);
    } catch {
      set(authAtom, false);
    }
  }
);
