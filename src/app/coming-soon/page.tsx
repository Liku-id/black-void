'use client';
import { useState, useEffect } from 'react';
import ThreeBackground from '@/components/visuals/three-background';
// Hapus import Header
import Image from 'next/image';
import logo from '@/assets/logo/white-logo.svg';
import './coming-soon.css';

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('July 30, 2025 00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-8 flex items-center justify-center gap-2 md:gap-4">
      <div className="text-center">
        <div className="font-onest mb-1 text-xl font-bold md:text-3xl">
          {timeLeft.days}
        </div>
        <div className="font-onest text-xs opacity-70">Days</div>
      </div>
      <div className="font-onest -mt-4 text-2xl font-bold text-white opacity-50 md:text-4xl">
        {timeLeft.days > 0 ? ':' : ''}
      </div>
      <div className="text-center">
        <div className="font-onest mb-1 text-xl font-bold md:text-3xl">
          {timeLeft.hours}
        </div>
        <div className="font-onest text-xs opacity-70">Hours</div>
      </div>
      <div className="font-onest -mt-4 text-2xl font-bold text-white opacity-50 md:text-4xl">
        {timeLeft.hours > 0 ? ':' : ''}
      </div>
      <div className="text-center">
        <div className="font-onest mb-1 text-xl font-bold md:text-3xl">
          {timeLeft.minutes}
        </div>
        <div className="font-onest text-xs opacity-70">Minutes</div>
      </div>
      <div className="font-onest -mt-4 text-2xl font-bold text-white opacity-50 md:text-4xl">
        {timeLeft.minutes > 0 ? ':' : ''}
      </div>
      <div className="text-center">
        <div className="font-onest mb-1 text-xl font-bold md:text-3xl">
          {timeLeft.seconds}
        </div>
        <div className="font-onest text-xs opacity-70">Seconds</div>
      </div>
    </div>
  );
}

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbyJoCeE0nvhs03xBvfmzJWM8a7O--37LC46vmdghR_38A1bHTjUYKY5AJneAn9npdkV/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
          mode: 'no-cors', // This will prevent CORS errors
        }
      );

      // Since we're using no-cors, we can't check response.ok
      // Assume success if no error is thrown
      setSubmitStatus('success');
      setEmail('');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Custom header dengan logo kiri atas dan background transparan */}
      <div className="fixed top-0 left-0 z-20 flex h-16 w-full items-center px-8 py-10">
        <Image
          src={logo}
          alt="Logo"
          height={32}
          width={120}
          className="h-8 w-auto"
          priority
        />
      </div>
      <ThreeBackground />
      <div className="flex min-h-screen flex-col">
        {/* Main content - top section */}
        <div className="relative flex min-h-screen items-center justify-center p-8">
          <div className="z-10 text-center text-white">
            <p className="font-onest mx-auto mb-6 max-w-2xl text-xl opacity-80 md:text-2xl">
              Something amazing is in the works
            </p>
            <h1 className="font-bebas mb-8 text-6xl font-black tracking-wider uppercase md:text-8xl">
              COMING SOON
            </h1>
            <CountdownTimer />
          </div>

          {/* Scroll down indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
            <div className="flex flex-col items-center text-white opacity-60">
              <span className="font-onest mb-2 text-sm">Scroll down</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Notification Section - bottom section */}
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="z-10 text-center text-white">
            <p className="font-onest mb-6 text-lg opacity-80">
              Get notified when we launch
            </p>
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="font-onest min-w-0 flex-1 border border-white/20 bg-white/10 px-6 py-3 text-white placeholder-white/60 transition-colors focus:border-white/40 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="font-onest bg-white px-8 py-3 font-semibold whitespace-nowrap text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting ? 'Sending...' : 'Notify Me'}
              </button>
            </form>

            {/* Status messages */}
            {submitStatus === 'success' && (
              <p className="font-onest mt-4 text-green-400">
                Thank you! We&apos;ll notify you when we launch.
              </p>
            )}
            {submitStatus === 'error' && (
              <p className="font-onest mt-4 text-red-400">
                Something went wrong. Please try again.
              </p>
            )}

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="font-onest text-sm opacity-60">
                Copyright © 2025 - PT Aku Rela Kamu Bahagia. All rights
                reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
