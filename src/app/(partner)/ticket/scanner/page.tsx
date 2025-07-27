'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Box, Typography } from '@/components';
import Image from 'next/image';
import logo from '@/assets/logo/white-logo.svg';
import { QrCode } from 'lucide-react';

export default function ScannerPage() {
  const [scannedData, setScannedData] = useState<any>({
        name: 'John Doe',
        ticketId: 'iakn',
        seat: 'A12',
      });
  const [cameraStarted, setCameraStarted] = useState(false);

  const handleScanSuccess = (decodedText: string) => {
    // Kamu bisa parsing JSON atau string dari QR di sini
    try {
      const parsed = JSON.parse(decodedText);
      setScannedData(parsed);
    } catch {
      setScannedData({
        name: 'John Doe',
        ticketId: decodedText,
        seat: 'A12',
      });
    }
  };

  return (
    <Box className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Logo kiri atas */}
      <Image
        src={logo}
        alt="Logo"
        height={32}
        width={120}
        className="absolute top-6 left-6 h-8 w-auto z-50"
        priority
      />

      {/* Fullscreen Camera Background */}
      {/* <QRCodeScanner
        cameraStarted={cameraStarted}
        onSuccess={handleScanSuccess}
        onStart={() => setCameraStarted(true)}
      /> */}

      {/* QR Code Scanner Area Overlay */}
      <Box className="absolute inset-0 flex flex-col items-center justify-center z-30">
        <Box className="w-80 h-80 relative">
          {/* Overlay dengan box-shadow dan border-radius */}
          <Box
            className="absolute inset-0 z-0 rounded-lg" // Tambahkan rounded-xl atau sesuai keinginan
            style={{
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)', // Overlay gelap di luar box
            }}
          />

          {/* Green corners */}
          <Box className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg z-10" />
          <Box className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg z-10" />
          <Box className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg z-10" />
          <Box className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg z-10" />

          {/* Scanning line animation */}
          {!scannedData && (
            <Box className="absolute top-0 left-0 w-full h-0.5 bg-green-400 animate-scan-shadow z-10" />
          )}
        </Box>

        <Typography
          size={12}
          className="mt-6 text-white text-center px-4 bg-black bg-opacity-50 py-2 rounded-lg"
        >
          Hold your camera steady over the QR code
        </Typography>
      </Box>

      {/* Loading state when camera not started */}
      {!cameraStarted && (
        <Box className="absolute inset-0 flex items-center justify-center text-gray-400 bg-black z-40">
          <Box className="text-center">
            <Box className="w-16 h-16 border-2 border-gray-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <QrCode size={32} />
            </Box>
            <p className="text-sm">Starting Camera...</p>
          </Box>
        </Box>
      )}

      {/* Ticket Info Slide Up */}
      <Box
        className={`absolute bottom-0 left-0 w-full px-4 transition-all duration-500 z-50 ${
          scannedData
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
        }`}
      >
        {scannedData && <TicketInfoCard data={scannedData} />}
      </Box>
    </Box>
  );
}

// QR Code Scanner Component with html5-qrcode (Fullscreen)
function QRCodeScanner({
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
                aspectRatio: 1.0,
              },
              (decodedText) => {
                onSuccess(decodedText);
                qrCodeScanner
                  .stop()
                  .catch((err) => console.error('Stop error', err));
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

  //   useEffect(() => {
  //     // Style the video element after camera starts
  //     if (cameraStarted) {
  //       setTimeout(() => {
  //         const timer = setTimeout(() => {
  //           const videoElement = scannerRef.current?.querySelector('video');
  //           if (videoElement) {
  //             videoElement.style.width = '100vw';
  //             videoElement.style.height = '100vh';
  //             videoElement.style.objectFit = 'cover';
  //             videoElement.style.position = 'absolute';
  //             videoElement.style.top = '0';
  //             videoElement.style.left = '0';
  //           }
  //         }, 500);

  //         return () => clearTimeout(timer);
  //       }, 1000);
  //     }
  //   }, [cameraStarted]);

  return (
    <Box
      id="qr-reader"
      ref={scannerRef}
      className="absolute inset-0 w-full h-full z-10"
    />
  );
}

// Ticket Info Card
function TicketInfoCard({ data }: { data: any }) {
  return (
    <Box className="bg-white text-black rounded-t-2xl shadow-xl p-6">
      <Typography className="text-xl font-semibold mb-2">
        Ticket Verified ✅
      </Typography>
      <Typography>Name: {data.name}</Typography>
      <Typography>Ticket ID: {data.ticketId}</Typography>
      <Typography>Seat: {data.seat}</Typography>
    </Box>
  );
}
