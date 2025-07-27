import { useEffect, useState } from 'react';

const useStickyObserver = (
  stickyRef: React.RefObject<HTMLDivElement>,
  sentinelRef: React.RefObject<HTMLDivElement>,
  offset: number = 0
) => {
  const [isSticky, setIsSticky] = useState(true);
  const [absoluteTop, setAbsoluteTop] = useState(0);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSticky(false);
          if (stickyRef.current && sentinelRef.current) {
            const scrollY = window.scrollY || window.pageYOffset;
            const sentinelRect = sentinelRef.current.getBoundingClientRect();
            setAbsoluteTop(
              scrollY +
                sentinelRect.top -
                stickyRef.current.offsetHeight -
                offset
            );
          }
        } else {
          setIsSticky(true);
        }
      },
      { root: null, threshold: 0 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [stickyRef, sentinelRef, offset]);

  return { isSticky, absoluteTop };
};

export default useStickyObserver;
