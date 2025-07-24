import { useState, useRef, useCallback } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

export function useBarcodeScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startScanning = useCallback(async (onScan: (code: string) => void) => {
    try {
      setError(null);
      setIsScanning(true);

      if (!readerRef.current) {
        readerRef.current = new BrowserMultiFormatReader();
      }

      const videoInputDevices = await readerRef.current.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        throw new Error('No camera devices found');
      }

      // Use the first available camera (usually back camera on mobile)
      const selectedDeviceId = videoInputDevices[0].deviceId;

      readerRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result: Result | null, error: Error | null) => {
          if (result) {
            const code = result.getText();
            setLastScannedCode(code);
            onScan(code);
          }
          if (error && !(error.name === 'NotFoundException')) {
            console.error('Barcode scanning error:', error);
          }
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start camera';
      setError(errorMessage);
      setIsScanning(false);
    }
  }, []);

  const stopScanning = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setIsScanning(false);
    setError(null);
  }, []);

  const scanFromImage = useCallback(async (imageFile: File): Promise<string | null> => {
    try {
      setError(null);
      
      if (!readerRef.current) {
        readerRef.current = new BrowserMultiFormatReader();
      }

      const result = await readerRef.current.decodeFromImageUrl(URL.createObjectURL(imageFile));
      const code = result.getText();
      setLastScannedCode(code);
      return code;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan barcode from image';
      setError(errorMessage);
      return null;
    }
  }, []);

  return {
    isScanning,
    error,
    lastScannedCode,
    videoRef,
    startScanning,
    stopScanning,
    scanFromImage
  };
}