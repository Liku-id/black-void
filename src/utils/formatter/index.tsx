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
      timeZone: 'UTC'
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
      // ISO string with Z or UTC - parse as UTC, no timezone conversion
      d = new Date(date);
    } else if (date.includes('+07:00') || date.includes('+0700')) {
      // Already in WIB timezone - parse directly
      d = new Date(date);
    } else if (date.includes('+') || date.includes('-')) {
      // Date with timezone offset - parse as is
      d = new Date(date);
    } else {
      // Plain date string, assume it's already in local time
      d = new Date(date);
    }
  } else {
    d = new Date(date);
  }

  return d;
}

export function getTodayWIB(): Date {
  const now = new Date();
  return now;
}

export function getTodayWIBString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function formatDate(
  date: string | Date,
  variant: 'day' | 'date' | 'full' | 'datetime' = 'full'
): string {
  // Parse date and use UTC methods to avoid timezone conversion
  const d = new Date(date);

  if (isNaN(d.getTime())) return '-';
  if (variant === 'day') {
    return d.toLocaleDateString('en-EN', { 
      weekday: 'long',
      timeZone: 'UTC'
    });
  }
  if (variant === 'date') {
    const day = d.getUTCDate();
    const month = d.toLocaleString('en-EN', { 
      month: 'short',
      timeZone: 'UTC'
    });
    const year = d.getUTCFullYear();
    return `${day} ${month} ${year}`;
  }
  if (variant === 'datetime') {
    // May 21, 2025, 05:00PM UTC
    const month = d.toLocaleString('en-EN', { 
      month: 'short',
      timeZone: 'UTC'
    });
    const day = d.getUTCDate();
    const year = d.getUTCFullYear();
    const time = d.toLocaleTimeString('en-EN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });

    return `${month} ${day}, ${year}, ${time}`;
  }
  // default 'full'
  return d.toLocaleDateString('en-EN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
}
