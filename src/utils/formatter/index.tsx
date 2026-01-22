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
    timeZone: 'Asia/Jakarta',
  })
    .format(new Date(date))
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
  return new Date();
}

export function getTodayWIBString(): string {
  const today = getTodayWIB();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function normalizeToDateOnlyWIB(
  dateString: string | null | undefined
): string {
  if (!dateString) return '';
  try {
    // Convert to WIB using existing utility
    const date = convertToWIB(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return '';

    // Format to YYYY-MM-DD in WIB timezone (Asia/Jakarta, UTC+7)
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return formatter.format(date);
  } catch (error) {
    // Fallback: try to extract date part directly
    const datePart = dateString.split('T')[0].split(' ')[0];
    return datePart;
  }
}

export function formatDate(
  date: string | Date,
  variant: 'day' | 'date' | 'full' | 'datetime' = 'full'
): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) return '-';

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Jakarta',
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
      const weekday = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: 'Asia/Jakarta',
      }).format(d);
      const datePart = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      }).format(d);
      const [day, , year] = datePart.split(' ');
      const monthEnglish = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        timeZone: 'Asia/Jakarta',
      }).format(d);
      return `${weekday}, ${day} ${monthEnglish} ${year}`;
  }

  return new Intl.DateTimeFormat('en-US', options).format(d);
}

export function formatStrToHTML(str: string): string {
  return str.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');
}

/**
 * Calculate price with partnership discount
 * @param originalPrice - Original ticket price
 * @param partnershipInfo - Partnership info object with discount
 * @returns Final price after applying discount
 */
export function calculatePriceWithPartnership(
  originalPrice: number,
  partnershipInfo?: {
    discount?: number;
    quota?: number;
    sold_count?: number;
    pending_count?: number;
    available_quota?: number;
    max_order_quantity?: number;
    partner_name?: string;
    partner_code?: string;
  } | null
): number {
  if (!partnershipInfo || !partnershipInfo.discount) {
    return originalPrice;
  }

  const discount = partnershipInfo.discount;

  // If discount is between 1-100, use as percentage
  if (discount >= 1 && discount <= 100) {
    return Math.round(originalPrice * ((100 - discount) / 100));
  }

  // If discount > 100, use as direct subtraction
  return Math.max(0, originalPrice - discount);
}
