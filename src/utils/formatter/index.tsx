export function formatRupiah(value: number | string): string {
  const number = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export function formatTime(date: string | Date): string {
  return new Date(date)
    .toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(':', '.');
}

export function formatCountdownTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

export function convertToWIB(date: string | Date): Date {
  let d: Date;

  if (typeof date === 'string') {
    // Handle various date formats
    if (date.includes('Z') || date.includes('UTC')) {
      // ISO string with Z or UTC
      d = new Date(date);
    } else if (date.includes('+') || date.includes('-')) {
      // Date with timezone offset
      d = new Date(date);
    } else {
      // Plain date string, assume it's already in local time
      d = new Date(date);
    }
  } else {
    d = new Date(date);
  }

  // Convert to WIB (UTC+7)
  const wibOffset = 7 * 60; // 7 hours in minutes
  const utcTime = d.getTime() + (d.getTimezoneOffset() * 60000);
  const wibTime = new Date(utcTime + (wibOffset * 60000));
  
  return wibTime;
}

export function getTodayWIB(): Date {
  const now = new Date();
  return convertToWIB(now);
}

export function getTodayWIBString(): string {
  const today = getTodayWIB();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function formatDate(
  date: string | Date,
  variant: 'day' | 'date' | 'full' | 'datetime' = 'full'
): string {
  // Convert to WIB first to ensure consistent timezone
  const d = convertToWIB(date);

  if (isNaN(d.getTime())) return '-';
  if (variant === 'day') {
    return d.toLocaleDateString('en-EN', { weekday: 'long' });
  }
  if (variant === 'date') {
    // DD MMMM YYYY
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-EN', { month: 'long' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }
  if (variant === 'datetime') {
    // May 21, 2025, 05:00PM GMT+8
    const month = d.toLocaleString('en-EN', { month: 'short' });
    const day = d.getDate();
    const year = d.getFullYear();
    const time = d.toLocaleTimeString('en-EN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const timezone =
      d
        .toLocaleTimeString('en-EN', {
          timeZoneName: 'short',
        })
        .split(' ')
        .pop() || 'GMT+8';

    return `${month} ${day}, ${year}, ${time} ${timezone}`;
  }
  // default 'full'
  return d.toLocaleDateString('en-EN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
