'use client';

import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { Box } from '@/components';
import { useRouter } from 'next/navigation';

/**
 * Example usage:
 * <Slider autoScroll={true} scrollInterval={3000} gap={6} itemWidth={100}>
 *   <CreatorCard logo="..." name="Creator 1" />
 *   <CreatorCard logo="..." name="Creator 2" />
 *   <CreatorCard logo="..." name="Creator 3" />
 *   <CreatorCard logo="..." name="Creator 4" />
 * </Slider>
 */

interface SliderProps {
  children: ReactNode;
  autoScroll?: boolean;
  scrollInterval?: number;
  gap?: number;
  itemWidth?: number;
  className?: string;
  draggable?: boolean;
  pagination?: boolean;
  pages?: string[];
  itemIds?: string[];
  clickableItems?: boolean[];
}

export function clampIndex(
  startIndex: number,
  dragOffset: number,
  totalItemWidth: number,
  childrenLength: number
) {
  const threshold = totalItemWidth / 4;
  const snapIndex =
    Math.abs(dragOffset) > threshold
      ? Math.round(dragOffset / totalItemWidth)
      : 0;
  let newIndex = startIndex + snapIndex;
  if (newIndex < 0) newIndex = 0;
  if (newIndex > childrenLength - 1) newIndex = childrenLength - 1;
  return newIndex;
}

export function Slider({
  children,
  autoScroll = true,
  scrollInterval = 3000,
  gap = 6,
  itemWidth = 100,
  className = '',
  draggable = true,
  pagination = false,
  pages,
  itemIds = [],
  clickableItems = [],
}: SliderProps) {
  const router = useRouter();
  const childrenArray = Array.isArray(children) ? children : [children];
  const totalItemWidth = itemWidth + gap;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const isDraggingRef = useRef(isDragging);
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;
    const onEnd = () => {
      if (isDraggingRef.current) handleEnd();
    };
    window.addEventListener('mouseup', onEnd, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!autoScroll || isDragging) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 1 >= childrenArray.length ? 0 : prev + 1
      );
    }, scrollInterval);
    return () => clearInterval(id);
  }, [autoScroll, scrollInterval, childrenArray.length, isDragging]);

  const handleStart = (x: number) => {
    setIsDragging(true);
    setStartX(x);
    setStartIndex(currentIndex);
    setDragOffset(0);
    setHasDragged(false);
  };

  const handleMove = (x: number) => {
    if (!isDragging) return;
    const walk = x - startX;
    if (Math.abs(walk) > 5) setHasDragged(true);
    setDragOffset(-walk);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!hasDragged) {
      const href = pages?.[currentIndex];
      setDragOffset(0);
      if (href) router.push(href);
      return;
    }
    const newIndex = clampIndex(
      startIndex,
      dragOffset,
      totalItemWidth,
      childrenArray.length
    );
    setCurrentIndex(newIndex);
    setDragOffset(0);
  };

  const handlePaginationClick = (index: number) => {
    setCurrentIndex(index);
    setDragOffset(0);
    setHasDragged(false);
  };

  const currentItemClickable = clickableItems[currentIndex] !== false;

  return (
    <Box className={className + ' flex flex-col items-center'}>
      <Box
        className={
          `relative w-full touch-pan-y overflow-hidden` +
          (draggable && currentItemClickable
            ? ` cursor-grab${isDragging ? ' cursor-grabbing' : ''}`
            : ' cursor-default')
        }
        {...(draggable
          ? {
              onMouseDown: (e: any) => handleStart(e.pageX),
              onMouseUp: handleEnd,
              onMouseMove: (e: any) => handleMove(e.pageX),
              onTouchStart: (e: any) => handleStart(e.touches[0].pageX),
              onTouchMove: (e: any) => handleMove(e.touches[0].pageX),
              onTouchEnd: handleEnd,
            }
          : {})}
      >
        <Box
          className="flex w-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIndex * totalItemWidth + dragOffset}px)`,
            gap: `${gap}px`,
          }}
        >
          {childrenArray.map((child, index) => (
            <Box
              key={index}
              id={itemIds[index] || undefined}
              className="flex-shrink-0 select-none"
              style={{ width: itemWidth }}
            >
              {child}
            </Box>
          ))}
        </Box>
      </Box>
      {/* Pagination */}
      {pagination && (
        <Box className="mt-4 flex w-full flex-row justify-center gap-2">
          {childrenArray.map((_, index) => (
            <button
              key={index}
              onClick={() => handlePaginationClick(index)}
              className={`h-1 cursor-pointer transition-colors ${
                index === currentIndex ? 'w-[44px] bg-white' : 'bg-gray w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
