'use client';

import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Box } from '@/components';

export default function QRCodeScanner({
  onSuccess,
  onStart,
  cameraStarted,
}: {
  onSuccess: (data: string) => void;
  onStart?: () => void;
  cameraStarted: boolean;
}) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const qrCodeScanner = new Html5Qrcode(scannerRef.current.id);
    html5QrCodeRef.current = qrCodeScanner;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          // Prioritas kamera belakang untuk mobile
          const backCamera = devices.find(
            (device) =>
              device.label.toLowerCase().includes('back') ||
              device.label.toLowerCase().includes('rear')
          );
          const cameraId = backCamera ? backCamera.id : devices[0].id;

          qrCodeScanner
            .start(
              cameraId,
              {
                fps: 10,
                aspectRatio: window.innerWidth / window.innerHeight,
              },
              (decodedText) => {
                onSuccess(decodedText);
                console.log('QR Code scanned:', decodedText);
                // qrCodeScanner
                //   .stop()
                //   .catch((err) => console.error('Stop error', err));
              },
              (errorMessage) => {
                // Optional: handle decode errors
              }
            )
            .then(() => {
              if (onStart) onStart();
            })
            .catch((err) => {
              console.error('Start failed:', err);
            });
        }
      })
      .catch((err) => {
        console.error('html5-qrcode start error:', err.message || err);
        alert('Failed to start camera: ' + (err.message || err));
      });

    return () => {
      qrCodeScanner
        .stop()
        .then(() => qrCodeScanner.clear())
        .catch((err) => console.error('Cleanup error', err));
    };
  }, [onSuccess]);

  useEffect(() => {
    if (cameraStarted) {
      const timer = setTimeout(() => {
        const videoElement = scannerRef.current?.querySelector('video');
        if (videoElement) {
          videoElement.style.width = '100vw';
          videoElement.style.height = '100vh';
          videoElement.style.objectFit = 'cover';
          videoElement.style.position = 'absolute';
          videoElement.style.top = '0';
          videoElement.style.left = '0';
          videoElement.style.zIndex = '20'; // lebih tinggi dari scanner box kalau perlu
        }
      }, 500); // Delay agar kamera betul-betul sudah render

      return () => clearTimeout(timer);
    }
  }, [cameraStarted]);

  return (
    <Box
      id="qr-reader"
      ref={scannerRef}
      className="absolute inset-0 w-full h-full z-10"
    />
  );
}
