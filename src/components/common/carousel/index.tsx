'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Button } from '@/components';
import Image from 'next/image';
import Link from 'next/link';
import carouselArrow from '@/assets/icons/carousel-arrow.svg';

interface CarouselProps {
  images: string[];
  pages?: string[];
  linkIds?: string[];
  width: number;
  height: number;
  sizes: string;
  className?: string;
  animate?: boolean;
  arrowPosition?: 'inside' | 'outside';
  priority?: boolean;
}

type Direction = 'next' | 'prev';

export function Carousel({
  images,
  pages = [],
  linkIds = [],
  width,
  height,
  sizes,
  className = '',
  animate = true,
  arrowPosition = 'outside',
  priority = false,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animasi state
  const [prevIndex, setPrevIndex] = useState(0);
  const [, setDirection] = useState<Direction>('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPrev, setShowPrev] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = (dir: Direction, newIndex: number) => {
    if (!animate) {
      setCurrentIndex(newIndex);
      return;
    }
    if (isAnimating) return;
    setDirection(dir);
    setPrevIndex(currentIndex);
    setShowPrev(true);
    setCurrentIndex(newIndex);
    setIsAnimating(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      setShowPrev(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const nextSlide = () => {
    startAnimation('next', (currentIndex + 1) % images.length);
  };

  const prevSlide = () => {
    startAnimation('prev', (currentIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex || (animate && isAnimating)) return;
    startAnimation(index > currentIndex ? 'next' : 'prev', index);
  };

  return (
    <Box className={`flex flex-col items-center ${className}`}>
      <Box className="relative h-full w-full">
        {/* Animasi */}
        {animate ? (
          <>
            {showPrev && (
              <Image
                src={images[prevIndex]}
                alt=""
                className={`absolute h-full w-full object-cover transition-opacity transition-transform duration-500 ${isAnimating ? 'scale-90 opacity-0' : 'scale-100 opacity-100'} `}
                width={width}
                height={height}
                sizes={sizes}
                draggable={false}
                unoptimized
              />
            )}
            {pages.length > 0 ? (
              <Link
                id={linkIds[currentIndex] || undefined}
                href={pages[currentIndex]}
                aria-label={`Details for slide ${currentIndex + 1}`}
                passHref>
                <Image
                  src={images[currentIndex]}
                  alt=""
                  className={`absolute h-full w-full object-cover transition-opacity transition-transform duration-500 ${isAnimating && showPrev ? 'scale-105' : 'scale-100'} cursor-pointer opacity-100`}
                  width={width}
                  height={height}
                  sizes={sizes}
                  draggable={false}
                  unoptimized
                  priority={priority}
                />
              </Link>
            ) : (
              <Image
                src={images[currentIndex]}
                alt=""
                className="absolute h-full w-full object-cover"
                width={width}
                height={height}
                sizes={sizes}
                draggable={false}
                unoptimized
                priority={priority}
              />
            )}
          </>
        ) : (
          <Link
            href={pages[currentIndex] || '#'}
            passHref
            aria-label={`View details for slide ${currentIndex + 1}`}
            id={linkIds[currentIndex] || undefined}>
            <Image
              src={images[currentIndex]}
              alt=""
              className="absolute h-full w-full cursor-pointer object-cover"
              width={width}
              height={height}
              sizes={sizes}
              draggable={false}
              unoptimized
              priority={priority}
            />
          </Link>
        )}

        {/* Left Arrow */}
        <Button
          onClick={prevSlide}
          className={
            arrowPosition === 'inside'
              ? 'absolute top-1/2 left-4 z-10 h-[46px] w-[46px] -translate-y-1/2 p-0'
              : 'absolute top-1/2 left-[-88px] z-10 h-[46px] w-[46px] -translate-y-1/2 p-0'
          }
          disabled={animate && isAnimating}>
          <Image src={carouselArrow} alt="Previous" width={46} height={46} />
        </Button>

        {/* Right Arrow */}
        <Button
          onClick={nextSlide}
          className={
            arrowPosition === 'inside'
              ? 'absolute top-1/2 right-4 z-10 h-[46px] w-[46px] -translate-y-1/2 p-0'
              : 'absolute top-1/2 right-[-88px] z-10 h-[46px] w-[46px] -translate-y-1/2 p-0'
          }
          disabled={animate && isAnimating}>
          <Image
            src={carouselArrow}
            alt="Next"
            width={46}
            height={46}
            className="rotate-180"
          />
        </Button>
      </Box>

      {/* Pagination Bar/Strip */}
      <Box className="mt-4 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
            className={`h-1 cursor-pointer transition-colors ${index === currentIndex ? 'w-[44px] bg-white' : 'bg-gray w-2'
              }`}
            disabled={animate && isAnimating}
          />
        ))}
      </Box>
    </Box>
  );
}
