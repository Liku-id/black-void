'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { QrCode } from 'lucide-react';
import { Box, Typography, Button } from '@/components';
import QRCodeScanner from '@/components/scanner/qr-scanner';
import TicketInfoCard from '@/components/scanner/Iinfo-card';


export default function ScannerPage() {
  const [scannedData, setScannedData] = useState<any | null>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);

  // Auto hide after 5s
  // useEffect(() => {
  //   if (scannedData) {
  //     setShowResult(true);
  //     const timeout = setTimeout(() => {
  //       setShowResult(false);
  //       setScannedData(null);
  //     }, 5000);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [scannedData]);

  const handleScanSuccess = async (ticketId: string) => {
    try {
      const { data } = await axios.get(`/api/tickets/${ticketId}`);

      if (data.status === 'issued') {
        await axios.put(`/api/tickets/${ticketId}`, {
          status: 'redeemed',
        });

        setScannedData({
          status: 'success',
          ...data,
        });
        setShowResult(true);
      } else {
        setScannedData({
          status: 'already_redeemed',
          ...data,
        });
        setShowResult(true);
        return;
      }

      // Play sound
      if (data.status === 'success') {
        successSound.current?.play();
      } else {
        errorSound.current?.play();
      }
      setCameraStarted(false);
    } catch {
      errorSound.current?.play();
      setScannedData({
        status: 'failed',
      });
    }
  };

  return (
    <Box className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Audio */}
      <audio ref={successSound} src="/sounds/success.mp3" />
      <audio ref={errorSound} src="/sounds/error.mp3" />

      {/* QR Scanner */}
      <QRCodeScanner
        cameraStarted={cameraStarted}
        onSuccess={handleScanSuccess}
        onStart={() => setCameraStarted(true)}
      />

      {/* Scanner Box Overlay */}
      <Box className="absolute inset-0 flex flex-col items-center justify-center z-30">
        <Box className="w-80 h-80 relative">
          <Box
            className="absolute inset-0 z-0 rounded-lg"
            style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)' }}
          />

          {/* Green Corners */}
          <Box className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg z-10" />
          <Box className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg z-10" />
          <Box className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg z-10" />
          <Box className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg z-10" />

          {/* Scanning Line */}
          {!showResult && (
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

      {/* Loading */}
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

      {/* Slide-Up Info */}
      <Box
        className={`absolute bottom-0 left-0 w-full px-4 transition-all duration-500 z-50 ${
          showResult
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
        }`}
      >
        {scannedData && <TicketInfoCard data={scannedData} />}
        <Box className="text-center mt-4">
          <Button
            onClick={() => {
              setShowResult(false);
              setScannedData(null);
            }}
          >
            Scan Again
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
