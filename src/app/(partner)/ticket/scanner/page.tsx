'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  QrCode,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Box, Typography, Button } from '@/components';
import QRCodeScanner from '@/components/scanner/qr-scanner';
import TicketInfoCard from '@/components/scanner/info-card';

interface ScannedData {
  status: 'success' | 'already_redeemed' | 'failed' | 'invalid_ticket';
  visitorName?: string;
  ticketName?: string;
  eventDate?: string;
  ticketId?: string;
  message?: string;
}

export default function ScannerPage() {
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);

  // Add scanning state to prevent multiple scans
  const [isScanning, setIsScanning] = useState(false);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);

  // Auto-start camera when component mounts
  useEffect(() => {
    setCameraStarted(true);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  const handleScanSuccess = async (ticketId: string) => {
    setIsScanning(true);
    setLoading(true);
    setError(null);
    setShowResult(true); // Set this IMMEDIATELY to stop scanner
    setScanCount((prev) => prev + 1);

    // Stop camera immediately to prevent further scans
    setCameraStarted(false);

    try {
      const { data } = await axios.get(`/api/tickets/${ticketId}`);

      if (data.success && data.data) {
        const ticketData = data.data;

        if (ticketData.ticket_status === 'issued') {
          // Update ticket status to redeemed
          await axios.put(`/api/tickets/${ticketId}`, {
            status: 'redeemed',
          });

          setScannedData({
            status: 'success',
            visitorName: ticketData.visitor_name,
            ticketName: ticketData.ticket_name,
            eventDate: ticketData.redeemed_at,
            ticketId: ticketId,
            message: 'Ticket successfully redeemed!',
          });

          successSound.current?.play();
        } else if (ticketData.ticket_status === 'redeemed') {
          setScannedData({
            status: 'already_redeemed',
            visitorName: ticketData.visitor_name,
            ticketName: ticketData.ticket_name,
            eventDate: ticketData.redeemed_at,
            ticketId: ticketId,
            message: 'This ticket has already been redeemed',
          });

          errorSound.current?.play();
        } else {
          setScannedData({
            status: 'invalid_ticket',
            ticketId: ticketId,
            message: `Invalid ticket status: ${ticketData.status}`,
          });

          errorSound.current?.play();
        }
      } else {
        setScannedData({
          status: 'failed',
          ticketId: ticketId,
          message: 'Failed to retrieve ticket information',
        });

        errorSound.current?.play();
      }

      setShowResult(true);
    } catch (error: any) {
      let errorMessage = 'Failed to process ticket';

      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Insufficient permissions.';
      } else if (
        error.response?.status === 404 ||
        error.response?.status >= 500
      ) {
        errorMessage = 'Ticket not found.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setScannedData({
        status: 'failed',
        ticketId: ticketId,
        message: errorMessage,
      });

      setError(errorMessage);
      errorSound.current?.play();
      // showResult already set to true at the beginning
    } finally {
      setLoading(false);

      // Reset scanning state after a longer delay
      scanTimeoutRef.current = setTimeout(() => {
        setIsScanning(false);
      }, 5000); // Increased to 5 seconds
    }
  };

  const resetScanner = () => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }

    setShowResult(false);
    setScannedData(null);
    setError(null);
    setIsScanning(false);
    setCameraInitialized(false);

    setTimeout(() => {
      setCameraStarted(true);
    }, 500);
  };

  const getStatusIcon = () => {
    if (loading)
      return (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      );
    if (scannedData?.status === 'success')
      return (
        <CheckCircle className="w-8 h-8 text-green-400 animate-success-pulse" />
      );
    if (scannedData?.status === 'already_redeemed')
      return <AlertCircle className="w-8 h-8 text-yellow-400" />;
    if (
      scannedData?.status === 'failed' ||
      scannedData?.status === 'invalid_ticket'
    )
      return <XCircle className="w-8 h-8 text-red-400 animate-error-shake" />;
    return <QrCode className="w-8 h-8 text-gray-400" />;
  };

  const getStatusText = () => {
    if (loading) return 'Processing...';
    if (scannedData?.status === 'success') return 'Success';
    if (scannedData?.status === 'already_redeemed') return 'Already Redeemed';
    if (
      scannedData?.status === 'failed' ||
      scannedData?.status === 'invalid_ticket'
    )
      return 'Error';
    return 'Ready to Scan';
  };

  return (
    <Box className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Audio */}
      <audio ref={successSound} src="/sounds/success.mp3" />
      <audio ref={errorSound} src="/sounds/error.mp3" />

      {/* Header */}
      <Box className="absolute top-0 left-0 right-0 z-40 bg-black bg-opacity-80 backdrop-blur-sm">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-3 absolute top-16 left-6">
            {getStatusIcon()}
            <Box>
              <Typography size={16} className="font-semibold">
                {getStatusText()}
              </Typography>
              <Typography size={12} className="text-gray-400">
                Scans: {scanCount}
              </Typography>
            </Box>
          </Box>

          {showResult && (
            <Button
              onClick={resetScanner}
              className="flex items-center gap-2 bg-white text-black hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4" />
              Scan Again
            </Button>
          )}
        </Box>
      </Box>

      {/* QR Scanner - Only render when needed */}
      {!showResult && (
        <QRCodeScanner
          cameraStarted={cameraStarted}
          onSuccess={handleScanSuccess}
          onStart={() => setCameraStarted(true)}
          onInitialized={setCameraInitialized}
          enableLogs={false}
          disabled={loading || isScanning || showResult}
        />
      )}

      {/* Scanner Box Overlay */}
      <Box className="absolute inset-0 flex flex-col items-center justify-center z-30 pt-20">
        <Box className="w-80 h-80 relative">
          <Box
            className="absolute inset-0 z-0 rounded-lg"
            style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)' }}
          />

          {/* Green Corners */}
          <Box className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg z-10 animate-corner-glow" />
          <Box className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg z-10 animate-corner-glow" />
          <Box className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg z-10 animate-corner-glow" />
          <Box className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg z-10 animate-corner-glow" />

          {/* Loading Overlay */}
          {loading && (
            <Box className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-20">
              <Box className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-2"></div>
                <Typography size={14} className="text-green-400">
                  Processing Ticket...
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Typography
          size={14}
          className="mt-6 text-white text-center px-6 py-3 bg-black bg-opacity-70 backdrop-blur-sm rounded-xl border border-gray-700"
        >
          {loading
            ? 'Processing ticket...'
            : showResult
              ? 'Scan complete'
              : isScanning
                ? 'Please wait...'
                : 'Position QR code within the frame'}
        </Typography>
      </Box>

      {/* Camera Loading - Only show briefly during initial load */}
      {(!cameraStarted || !cameraInitialized) && !showResult && (
        <Box className="absolute inset-0 flex items-center justify-center text-gray-400 bg-black z-40">
          <Box className="text-center">
            <Box className="w-20 h-20 border-2 border-gray-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <QrCode size={40} />
            </Box>
            <Typography size={16} className="mb-2">
              Initializing Scanner...
            </Typography>
            <Typography size={12} className="text-gray-500">
              Please allow camera access when prompted
            </Typography>
          </Box>
        </Box>
      )}

      {/* Error Display */}
      {error && !showResult && (
        <Box className="absolute top-20 left-4 right-4 z-50">
          <Box className="bg-red-500 text-white p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <Typography size={14}>{error}</Typography>
          </Box>
        </Box>
      )}

      {/* Slide-Up Result */}
      <Box
        className={`absolute bottom-0 left-0 w-full scanner-transition z-50 ${
          showResult
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
        }`}
      >
        {scannedData && (
          <TicketInfoCard data={scannedData} resetScanner={resetScanner} />
        )}
      </Box>
    </Box>
  );
}
