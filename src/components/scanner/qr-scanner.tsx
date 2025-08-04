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
            (d) =>
              d.label.toLowerCase().includes('back') ||
              d.label.toLowerCase().includes('rear') ||
              d.label.toLowerCase().includes('environment')
          ) || devices[0];

        const config = {
          fps: 10,
          disableFlip: false,
        };

        await qrCodeScanner.start(
          selectedCamera.id,
          config,
          async (decodedText) => {
            // ✅ Prevent multiple calls
            if (hasScannedRef.current) return;
            hasScannedRef.current = true;

            if (enableLogs) console.log('QR scanned:', decodedText);

            // stop scanner immediately
            await stopScanner();

            // Call parent handler
            onSuccess(decodedText);
          },
          (errorMessage) => {
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
    <Box className="relative w-full h-full">
      <Box
        id="qr-reader"
        ref={scannerRef}
        className={`absolute inset-0 w-full h-full z-10 ${disabled ? 'opacity-50' : ''}`}
      />

      {disabled && (
        <Box className="absolute inset-0 bg-black bg-opacity-50 z-25 flex items-center justify-center">
          <Typography size={14} className="text-gray-400">
            Scanner Disabled
          </Typography>
        </Box>
      )}

      {cameraError && (
        <Box className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-30">
          <Box className="text-center p-6 max-w-sm">
            <Box className="w-16 h-16 border-2 border-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Typography size={24} className="text-red-500">
                !
              </Typography>
            </Box>
            <Typography size={16} className="text-white mb-2">
              Camera Error
            </Typography>
            <Typography size={14} className="text-gray-300 text-center">
              {cameraError}
            </Typography>
          </Box>
        </Box>
      )}

      {isInitializing && cameraStarted && !cameraError && !disabled && (
        <Box className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <Box className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <Typography size={14} className="text-green-400">
              Initializing Camera...
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
