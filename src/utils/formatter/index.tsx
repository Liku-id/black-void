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
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  }).format(new Date(date)).replace(':', '.');
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
      // ISO string with Z or UTC - parse as UTC and convert to WIB
      d = new Date(date);
      // Add 7 hours to convert UTC to WIB
      d = new Date(d.getTime() + 7 * 60 * 60 * 1000);
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
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '-';
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Jakarta'
  };

  switch (variant) {
    case 'day':
      options.weekday = 'long';
      break;
    case 'date':
      options.day = 'numeric';
      options.month = 'short';
      options.year = 'numeric';
      break;
    case 'datetime':
      options.day = 'numeric';
      options.month = 'short';
      options.year = 'numeric';
      options.hour = 'numeric';
      options.minute = '2-digit';
      options.hour12 = true;
      break;
    case 'full':
    default:
      options.weekday = 'long';
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      break;
  }

  return new Intl.DateTimeFormat('en-US', options).format(d);
}
