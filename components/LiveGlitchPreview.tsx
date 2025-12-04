'use client';

import { useEffect, useRef } from 'react';
import { GlitchConfig } from '@/types/glitch';

interface LiveGlitchPreviewProps {
  config: GlitchConfig;
  imageUrl: string;
  title: string;
}

export default function LiveGlitchPreview({ config, imageUrl, title }: LiveGlitchPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const applyRGBSplit = (imageData: ImageData, amount: number) => {
    const data = imageData.data;
    const width = imageData.width;
    const offset = Math.floor(amount);

    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (x + offset < width) {
          const targetIdx = (y * width + (x + offset)) * 4;
          data[targetIdx] = data[idx];
        }
        if (x - offset >= 0) {
          const targetIdx = (y * width + (x - offset)) * 4;
          data[targetIdx + 2] = data[idx + 2];
        }
      }
    }
  };

  const applyNoise = (imageData: ImageData, intensity: number) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < intensity) {
        const noise = (Math.random() - 0.5) * 255;
        data[i] += noise;
        data[i + 1] += noise;
        data[i + 2] += noise;
      }
    }
  };

  const applyBlockGlitch = (imageData: ImageData, blockSize: number) => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        if (Math.random() < 0.3) {
          const offsetX = Math.floor((Math.random() - 0.5) * blockSize * 2);
          const offsetY = Math.floor((Math.random() - 0.5) * blockSize * 2);
          
          for (let by = 0; by < blockSize && y + by < height; by++) {
            for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
              const sourceX = Math.max(0, Math.min(width - 1, x + bx + offsetX));
              const sourceY = Math.max(0, Math.min(height - 1, y + by + offsetY));
              
              const sourceIdx = (sourceY * width + sourceX) * 4;
              const targetIdx = ((y + by) * width + (x + bx)) * 4;
              
              data[targetIdx] = data[sourceIdx];
              data[targetIdx + 1] = data[sourceIdx + 1];
              data[targetIdx + 2] = data[sourceIdx + 2];
            }
          }
        }
      }
    }
  };

  const applyScanlines = (imageData: ImageData, opacity: number) => {
    const data = imageData.data;
    const width = imageData.width;
    for (let y = 0; y < imageData.height; y += 2) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        data[idx] *= (1 - opacity);
        data[idx + 1] *= (1 - opacity);
        data[idx + 2] *= (1 - opacity);
      }
    }
  };

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      sourceImageRef.current = img;
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        if (container) {
          const size = Math.min(container.clientWidth, container.clientHeight);
          canvas.width = size;
          canvas.height = size;
        }
        startAnimation();
      }
    };
    img.src = imageUrl;

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [imageUrl]);

  const startAnimation = () => {
    if (!sourceImageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let startTime = Date.now();
    const duration = config.duration * 1000;

    const animate = () => {
      if (!sourceImageRef.current || !canvasRef.current) return;

      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(sourceImageRef.current, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (config.shaderModules.includes('rgbSplit') && config.params.splitDistance) {
        applyRGBSplit(imageData, config.params.splitDistance * (1 + Math.sin(progress * Math.PI * 2)));
      }

      if (config.shaderModules.includes('noise') && config.params.noiseIntensity) {
        applyNoise(imageData, config.params.noiseIntensity * 0.1);
      }

      if (config.shaderModules.includes('glitchBlocks') && config.params.blockSize) {
        applyBlockGlitch(imageData, config.params.blockSize);
      }

      if (config.shaderModules.includes('scanlines') && config.params.scanlineOpacity) {
        applyScanlines(imageData, config.params.scanlineOpacity);
      }

      ctx.putImageData(imageData, 0, 0);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="group relative aspect-square bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500 transition-all">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <div className="flex gap-1 mt-2 flex-wrap">
            {config.shaderModules.map((module) => (
              <span
                key={module}
                className="px-2 py-0.5 bg-cyan-500/30 text-cyan-300 rounded text-[10px]"
              >
                {module}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
