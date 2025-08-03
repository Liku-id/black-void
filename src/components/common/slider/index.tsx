'use client';

import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { Box } from '@/components';

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
}: SliderProps) {
  const childrenArray = Array.isArray(children) ? children : [children];
  const totalItemWidth = itemWidth + gap * 4;

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
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev =>
        prev + 1 >= childrenArray.length ? 0 : prev + 1
      );
    }, scrollInterval);
    return () => clearInterval(interval);
  }, [autoScroll, scrollInterval, childrenArray.length]);

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
      setDragOffset(0);
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
    setHasDragged(false);
  };

  const handlePaginationClick = (index: number) => {
    setCurrentIndex(index);
    setDragOffset(0);
    setHasDragged(false);
  };

  return (
    <Box className={className + ' flex flex-col items-center'}>
      <Box
        className={
          `relative w-full overflow-hidden` +
          (draggable
            ? ` cursor-grab${isDragging ? ' cursor-grabbing' : ''}`
            : '')
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
          : {})}>
        <Box
          className={'flex w-full transition-transform duration-300 ease-out'}
          style={{
            transform: `translateX(-${currentIndex * itemWidth + dragOffset}px)`,
            gap: `${gap}px`,
          }}>
          {childrenArray.map((child, index) => (
            <Box
              key={index}
              className="flex-shrink-0 select-none"
              style={{ width: itemWidth }}>
              {child}
            </Box>
          ))}
        </Box>
      </Box>
      {/* Pagination Bar Bawah */}
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
