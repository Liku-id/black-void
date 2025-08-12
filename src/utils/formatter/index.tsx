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

export function formatDate(
  date: string | Date,
  variant: 'day' | 'date' | 'full' | 'datetime' = 'full'
): string {
  let d: Date;

  if (typeof date === 'string') {
    // ex: 2025-07-14 18:51:19.91875 +0700 WIB
    const match = date.match(
      /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(?:\.\d+)? ([+-]\d{2})(\d{2})/
    );
    if (match) {
      const [_, year, month, day, hour, min, sec, offsetH, offsetM] = match;
      const iso = `${year}-${month}-${day}T${hour}:${min}:${sec}${offsetH}:${offsetM}`;
      d = new Date(iso);
    } else {
      d = new Date(date);
    }
  } else {
    d = new Date(date);
  }

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
