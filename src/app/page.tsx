"use client";
import { useState, useEffect } from "react";
import ThreeBackground from "@/components/ThreeBackground";
import Header from "@/components/Header";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('July 30, 2025 00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2 md:gap-4 mb-8 justify-center items-center">
      <div className="text-center">
        <div className="text-xl md:text-3xl font-bold mb-1 font-onest">{timeLeft.days}</div>
        <div className="text-xs opacity-70 font-onest">Days</div>
      </div>
      <div className="text-2xl md:text-4xl font-bold text-white opacity-50 font-onest -mt-4">{timeLeft.days > 0 ? ':' : ''}</div>
      <div className="text-center">
        <div className="text-xl md:text-3xl font-bold mb-1 font-onest">{timeLeft.hours}</div>
        <div className="text-xs opacity-70 font-onest">Hours</div>
      </div>
      <div className="text-2xl md:text-4xl font-bold text-white opacity-50 font-onest -mt-4">{timeLeft.hours > 0 ? ':' : ''}</div>
      <div className="text-center">
        <div className="text-xl md:text-3xl font-bold mb-1 font-onest">{timeLeft.minutes}</div>
        <div className="text-xs opacity-70 font-onest">Minutes</div>
      </div>
      <div className="text-2xl md:text-4xl font-bold text-white opacity-50 font-onest -mt-4">{timeLeft.minutes > 0 ? ':' : ''}</div>
      <div className="text-center">
        <div className="text-xl md:text-3xl font-bold mb-1 font-onest">{timeLeft.seconds}</div>
        <div className="text-xs opacity-70 font-onest">Seconds</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await fetch('https://script.google.com/a/macros/eku.id/s/AKfycbyO4IxRCAqvSldoi_hGjHpinUc3LZ7tnBWljKRBWMgy48HJTdP7VryPsDvm6Jn31kKp/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        mode: 'no-cors', // This will prevent CORS errors
      });

      // Since we're using no-cors, we can't check response.ok
      // Assume success if no error is thrown
      setSubmitStatus('success');
      setEmail('');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ThreeBackground />
      <Header />
      <div className="flex flex-col min-h-screen">
        {/* Main content - top section */}
        <div className="flex items-center justify-center min-h-screen p-8 relative">
          <div className="text-center text-white z-10">
            <p className="text-xl md:text-2xl mb-6 opacity-80 max-w-2xl mx-auto font-onest">
              Something amazing is in the works
            </p>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-wider uppercase font-bebas">
              COMING SOON
            </h1>
            <CountdownTimer />
          </div>
          
          {/* Scroll down indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center text-white opacity-60">
              <span className="text-sm mb-2 font-onest">Scroll down</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Notification Section - bottom section */}
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="text-center text-white z-10">
            <p className="text-lg mb-6 opacity-80 font-onest">
              Get notified when we launch
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-colors flex-1 min-w-0 font-onest"
                required
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-white text-black font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap font-onest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Notify Me'}
              </button>
            </form>
            
            {/* Status messages */}
            {submitStatus === 'success' && (
              <p className="text-green-400 mt-4 font-onest">Thank you! We&apos;ll notify you when we launch.</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-400 mt-4 font-onest">Something went wrong. Please try again.</p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <div className="text-sm opacity-60 font-onest">
                Copyright © 2025 - PT Aku Rela Kamu Bahagia. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
