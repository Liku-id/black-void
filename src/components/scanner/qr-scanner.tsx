'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Box, Typography } from '@/components';

export default function QRCodeScanner({
  onSuccess,
  onStart,
  cameraStarted,
  onInitialized,
  enableLogs = false,
  disabled = false,
}: {
  onSuccess: (data: string) => void;
  onStart?: () => void;
  cameraStarted: boolean;
  onInitialized?: (initialized: boolean) => void;
  enableLogs?: boolean;
  disabled?: boolean;
}) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const hasScannedRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        if (enableLogs) console.error('Error stopping scanner:', err);
      } finally {
        html5QrCodeRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (!scannerRef.current || !cameraStarted || disabled) return;

    const initializeScanner = async () => {
      try {
        setIsInitializing(true);
        setCameraError(null);
        hasScannedRef.current = false; // reset guard

        const qrCodeScanner = new Html5Qrcode(scannerRef.current!.id);
        html5QrCodeRef.current = qrCodeScanner;

        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          throw new Error(
            'No cameras found. Please check your camera permissions.'
          );
        }

        const selectedCamera =
          devices.find(
            d =>
              d.label.toLowerCase().includes('back') ||
              d.label.toLowerCase().includes('rear') ||
              d.label.toLowerCase().includes('environment')
          ) || devices[0];

        const config = {
          fps: 10,
          videoConstraints: {
            facingMode: 'environment', // prefer kamera belakang di HP
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        await qrCodeScanner.start(
          selectedCamera.id,
          config,
          async decodedText => {
            // ✅ Prevent multiple calls
            if (hasScannedRef.current) return;
            hasScannedRef.current = true;

            if (enableLogs) console.log('QR scanned:', decodedText);

            // stop scanner immediately
            await stopScanner();

            // Call parent handler
            onSuccess(decodedText);
          },
          errorMessage => {
            if (enableLogs) {
              console.log('QR decode error (normal):', errorMessage);
            }
          }
        );

        if (onStart) onStart();
        setIsInitializing(false);
        if (onInitialized) onInitialized(true);
      } catch (error: any) {
        console.error('Scanner initialization error:', error);
        setCameraError(error.message || 'Failed to start camera');
        setIsInitializing(false);
      }
    };

    initializeScanner();

    return () => {
      stopScanner();
    };
  }, [cameraStarted, disabled]);

  return (
    <Box className="relative h-full w-full">
      <Box
        id="qr-reader"
        ref={scannerRef}
        className={`absolute inset-0 z-10 h-full w-full ${disabled ? 'opacity-50' : ''}`}
      />

      {disabled && (
        <Box className="bg-opacity-50 absolute inset-0 z-25 flex items-center justify-center bg-black">
          <Typography size={14} className="text-gray-400">
            Scanner Disabled
          </Typography>
        </Box>
      )}

      {cameraError && (
        <Box className="bg-opacity-90 absolute inset-0 z-30 flex items-center justify-center bg-black">
          <Box className="max-w-sm p-6 text-center">
            <Box className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500">
              <Typography size={24} className="text-red-500">
                !
              </Typography>
            </Box>
            <Typography size={16} className="mb-2 text-white">
              Camera Error
            </Typography>
            <Typography size={14} className="text-center text-gray-300">
              {cameraError}
            </Typography>
          </Box>
        </Box>
      )}

      {isInitializing && cameraStarted && !cameraError && !disabled && (
        <Box className="bg-opacity-50 absolute inset-0 z-30 flex items-center justify-center bg-black">
          <Box className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-green-400"></div>
            <Typography size={14} className="text-green-400">
              Initializing Camera...
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
