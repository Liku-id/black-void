import { useEffect, useState, useCallback } from 'react';

const useStickyObserver = (
  stickyRef: React.RefObject<HTMLDivElement>,
  sentinelRef: React.RefObject<HTMLDivElement>,
  offset: number = 0
) => {
  const [isSticky, setIsSticky] = useState(true);
  const [absoluteTop, setAbsoluteTop] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const updateAbsoluteTop = useCallback(() => {
    if (stickyRef.current && sentinelRef.current) {
      const scrollY = window.scrollY || window.pageYOffset;
      const sentinelRect = sentinelRef.current.getBoundingClientRect();
      const stickyHeight = stickyRef.current.offsetHeight;
      const calculatedTop = scrollY + sentinelRect.top - stickyHeight - offset;

      setAbsoluteTop(calculatedTop);
      setIsReady(true);
    }
  }, [stickyRef, sentinelRef, offset]);

  useEffect(() => {
    // Initial calculation with a small delay to ensure DOM is ready
    const initialTimer = setTimeout(() => {
      updateAbsoluteTop();
    }, 0);

    // Also recalculate when offset changes
    const offsetTimer = setTimeout(() => {
      updateAbsoluteTop();
    }, 100);

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSticky(false);
          updateAbsoluteTop();
        } else {
          setIsSticky(true);
        }
      },
      { root: null, threshold: 0 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    // Handle window resize
    const handleResize = () => {
      updateAbsoluteTop();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(offsetTimer);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [stickyRef, sentinelRef, offset, updateAbsoluteTop]);

  return { isSticky, absoluteTop, isReady };
};

export default useStickyObserver;
