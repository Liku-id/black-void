'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function UTMTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const utmSource = searchParams.get('utm_source');

      if (utmSource) {
        const utmParams = {
          utm_source: utmSource,
          utm_medium: searchParams.get('utm_medium') || null,
          utm_campaign: searchParams.get('utm_campaign') || null,
          utm_term: searchParams.get('utm_term') || null,
          utm_content: searchParams.get('utm_content') || null,
          referrer: document.referrer || 'direct',
          timestamp: new Date().toISOString(),
        };

        sessionStorage.setItem('landing_utm_metadata', JSON.stringify(utmParams));
      } else if (!sessionStorage.getItem('landing_utm_metadata')) {
        const referrer = document.referrer;
        if (referrer && !referrer.includes(window.location.hostname)) {
          sessionStorage.setItem(
            'landing_utm_metadata',
            JSON.stringify({
              utm_source: null,
              utm_medium: null,
              utm_campaign: null,
              utm_term: null,
              utm_content: null,
              referrer: referrer,
              timestamp: new Date().toISOString(),
            })
          );
        }
      }
    }
  }, [searchParams]);

  return null;
}

export default function TrackingProvider() {
  return (
    <Suspense fallback={null}>
      <UTMTracker />
    </Suspense>
  );
}
