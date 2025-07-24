import React, { useEffect, useState } from 'react';
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner';
import { Modal } from './Modal';
import { Button } from './Button';
import { Card } from './Card';
import { Camera, Upload, X, Scan, CheckCircle, AlertCircle } from 'lucide-react';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
  title?: string;
}

export function BarcodeScanner({ isOpen, onClose, onScan, title = 'สแกนบาร์โค้ด' }: BarcodeScannerProps) {
  const { isScanning, error, lastScannedCode, videoRef, startScanning, stopScanning, scanFromImage } = useBarcodeScanner();
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && scanMode === 'camera') {
      startScanning((code) => {
        setScannedResult(code);
        // Auto-close after successful scan
        setTimeout(() => {
          onScan(code);
          handleClose();
        }, 1500);
      });
    }

    return () => {
      if (isScanning) {
        stopScanning();
      }
    };
  }, [isOpen, scanMode, startScanning, stopScanning, isScanning, onScan]);

  const handleClose = () => {
    stopScanning();
    setScannedResult(null);
    onClose();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const code = await scanFromImage(file);
    if (code) {
      setScannedResult(code);
      setTimeout(() => {
        onScan(code);
        handleClose();
      }, 1500);
    }
  };

  const handleManualInput = () => {
    const code = prompt('Enter barcode manually:');
    if (code && code.trim()) {
      onScan(code.trim());
      handleClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="lg">
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="flex space-x-2">
          <Button
            variant={scanMode === 'camera' ? 'primary' : 'secondary'}
            onClick={() => setScanMode('camera')}
            className="flex items-center space-x-2 flex-1"
          >
            <Camera className="w-4 h-4" />
            <span>กล้อง</span>
          </Button>
          <Button
            variant={scanMode === 'upload' ? 'primary' : 'secondary'}
            onClick={() => setScanMode('upload')}
            className="flex items-center space-x-2 flex-1"
          >
            <Upload className="w-4 h-4" />
            <span>อัปโหลดรูปภาพ</span>
          </Button>
        </div>

        {/* Scanner Content */}
        {scanMode === 'camera' && (
          <Card className="p-6">
            <div className="relative">
              {/* Video Preview */}
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanning Frame */}
                    <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                      
                      {/* Scanning Line Animation */}
                      {isScanning && !scannedResult && (
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Status Icons */}
                    {scannedResult && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-green-500 rounded-full p-3">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white text-sm text-center">
                      {scannedResult ? (
                        <span className="text-green-400 flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>สแกนบาร์โค้ดสำเร็จ!</span>
                        </span>
                      ) : isScanning ? (
                        <span className="flex items-center justify-center space-x-2">
                          <Scan className="w-4 h-4 animate-pulse" />
                          <span>วางบาร์โค้ดให้อยู่ในกรอบ</span>
                        </span>
                      ) : (
                        'กำลังเปิดกล้อง...'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {scanMode === 'upload' && (
          <Card className="p-6">
            <div className="text-center">
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8">
                <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 mb-4">อัปโหลดรูปภาพที่มีบาร์โค้ด</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="barcode-upload"
                />
                <label htmlFor="barcode-upload">
                  <Button variant="secondary" className="cursor-pointer">
                    เลือกรูปภาพ
                  </Button>
                </label>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              {scannedResult && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">ตรวจพบบาร์โค้ด: {scannedResult}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Scanned Result Display */}
        {scannedResult && (
          <Card className="p-4 bg-green-500/10 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 font-medium">บาร์โค้ดที่สแกน:</p>
                <p className="text-white font-mono text-lg">{scannedResult}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={handleManualInput}
            className="flex items-center space-x-2"
          >
            <span>ป้อนด้วยตนเอง</span>
          </Button>
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            ยกเลิก
          </Button>
        </div>
      </div>
    </Modal>
  );
}