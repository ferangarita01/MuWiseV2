// src/components/signature-canvas.tsx
'use client';

import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureCanvasProps {
  onSignatureEnd: (signature: string | null) => void;
  color?: string;
  weight?: number;
}

export interface SignatureCanvasHandle {
  clear: () => void;
  getSignature: () => string | null;
}

const CustomSignatureCanvas = forwardRef<SignatureCanvasHandle, SignatureCanvasProps>(
  ({ onSignatureEnd, color = '#0f172a', weight = 2.2 }, ref) => {
    const sigCanvas = useRef<SignatureCanvas | null>(null);
    const [isSigned, setIsSigned] = useState(false);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const updateWidth = () => {
        if (containerRef.current) {
          setCanvasWidth(containerRef.current.offsetWidth);
        }
      };
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handleBeginStroke = () => {
      setIsSigned(true);
    };

    const handleEndStroke = () => {
      if (sigCanvas.current) {
        if (sigCanvas.current.isEmpty()) {
          setIsSigned(false);
          onSignatureEnd(null);
        } else {
          setIsSigned(true);
          const signatureData = sigCanvas.current.toDataURL('image/png');
          onSignatureEnd(signatureData);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      clear: () => {
        if (sigCanvas.current) {
          sigCanvas.current.clear();
          setIsSigned(false);
          onSignatureEnd(null);
        }
      },
      getSignature: () => {
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
          return sigCanvas.current.toDataURL('image/png');
        }
        return null;
      },
    }));

    return (
      <div ref={containerRef} className="relative w-full h-36 rounded-md border border-secondary bg-background/50 ring-1 ring-white/5">
        {!isSigned && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-foreground/30">Firme Aquí</span>
          </div>
        )}
        <SignatureCanvas
          ref={sigCanvas}
          penColor={color}
          dotSize={weight}
          canvasProps={{
            width: canvasWidth,
            height: 142,
            className: 'rounded-md bg-white',
          }}
          onBegin={handleBeginStroke}
          onEnd={handleEndStroke}
        />
      </div>
    );
  }
);

CustomSignatureCanvas.displayName = 'SignatureCanvas';

export { CustomSignatureCanvas as SignatureCanvas };
