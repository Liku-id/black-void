import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const contactDetailAtom = atom({
  full_name: '',
  phone_number: '',
  country_code: '',
  email: '',
});

export type OrderBookingState = {
  orderId: string | null;
  expiredAt: string | null;
};

const initialOrderBookingState: OrderBookingState = {
  orderId: null,
  expiredAt: null,
};

export const orderBookingAtom = atomWithStorage<OrderBookingState>(
  'orderBooking',
  initialOrderBookingState
);

export const resetOrderBookingAtom = atom(null, (get, set) => {
  set(orderBookingAtom, initialOrderBookingState);
});
