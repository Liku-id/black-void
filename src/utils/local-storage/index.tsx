const ORDER_ID_KEY = 'orderId';

export function setOrderId(orderId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ORDER_ID_KEY, orderId);
  }
}

export function getOrderId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ORDER_ID_KEY);
  }
  return null;
}

export function removeOrderId() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ORDER_ID_KEY);
  }
}
