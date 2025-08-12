'use client';
import React, { useEffect, useState } from 'react';
import QR from 'qrcode';
import Image from 'next/image';
import { Box } from '@/components';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 160,
  className = '',
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsLoading(true);
        setError('');

        const qrCodeDataUrl = await QR.toDataURL(value, {
          width: size,
          margin: 0,
        });
        setQrCodeUrl(qrCodeDataUrl);
      } catch (err) {
        setError('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    };

    if (value && value.trim() !== '') {
      generateQRCode();
    } else {
      setIsLoading(false);
      setError('No QR data available');
    }
  }, [value, size]);

  if (isLoading) {
    return (
      <Box
        className={`animate-pulse bg-gray-200 ${className}`}
        style={{ width: size, height: size }}></Box>
    );
  }

  if (error) {
    return (
      <Box
        className={`flex items-center justify-center bg-gray-50 ${className}`}
        style={{ width: size, height: size }}>
        <Box className="text-center text-xs text-gray-500">
          QR code not available
        </Box>
      </Box>
    );
  }

  return (
    <Box className={`flex items-center justify-center ${className}`}>
      <Image
        src={qrCodeUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="h-full w-full"
      />
    </Box>
  );
};

export default QRCode;
