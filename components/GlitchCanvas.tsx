'use client';

import { useEffect, useRef, useState } from 'react';
import { useGlitchStore } from '@/lib/store';
import { PerformanceMonitor, throttle } from '@/lib/performance';

// Singleton performance monitor
let globalPerformanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!globalPerformanceMonitor) {
    globalPerformanceMonitor = new PerformanceMonitor();
  }
  return globalPerformanceMonitor;
}

export default function GlitchCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const { config } = useGlitchStore();
  const [isAnimating, setIsAnimating] = useState(true);

  // Load image when source changes
  useEffect(() => {
    if (!config.imageSource) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      sourceImageRef.current = img;
      if (canvasRef.current) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
      }
    };
    img.src = config.imageSource;
  }, [config.imageSource]);

  // Glitch effect functions
  const applyRGBSplit = (imageData: ImageData, amount: number) => {
    const data = imageData.data;
    const width = imageData.width;
    const offset = Math.floor(amount);

    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        
        // Shift red channel
        if (x + offset < width) {
          const targetIdx = (y * width + (x + offset)) * 4;
          data[targetIdx] = data[idx];
        }
        
        // Shift blue channel
        if (x - offset >= 0) {
          const targetIdx = (y * width + (x - offset)) * 4;
          data[targetIdx + 2] = data[idx + 2];
        }
      }
    }
  };

  const applyPixelSort = (imageData: ImageData, threshold: number) => {
    const data = imageData.data;
    const width = imageData.width;
    
    for (let y = 0; y < imageData.height; y++) {
      const row: { r: number; g: number; b: number; a: number }[] = [];
      
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        row.push({
          r: data[idx],
          g: data[idx + 1],
          b: data[idx + 2],
          a: data[idx + 3],
        });
      }
      
      // Sort by brightness
      row.sort((a, b) => {
        const brightA = a.r * 0.299 + a.g * 0.587 + a.b * 0.114;
        const brightB = b.r * 0.299 + b.g * 0.587 + b.b * 0.114;
        return brightA - brightB;
      });
      
      // Apply sorted pixels based on threshold
      if (Math.random() < threshold) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          data[idx] = row[x].r;
          data[idx + 1] = row[x].g;
          data[idx + 2] = row[x].b;
          data[idx + 3] = row[x].a;
        }
      }
    }
  };

  const applyNoise = (imageData: ImageData, intensity: number) => {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < intensity) {
        const noise = (Math.random() - 0.5) * 255;
        data[i] += noise;     // R
        data[i + 1] += noise; // G
        data[i + 2] += noise; // B
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
          // Random block displacement
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

  const applyColorShift = (imageData: ImageData, amount: number) => {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const temp = data[i]; // R
      data[i] = data[i + 1] * amount + data[i] * (1 - amount); // R = G
      data[i + 1] = data[i + 2] * amount + data[i + 1] * (1 - amount); // G = B
      data[i + 2] = temp * amount + data[i + 2] * (1 - amount); // B = R
    }
  };

  const applyChromaticAberration = (imageData: ImageData, strength: number) => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const tempData = new Uint8ClampedArray(data);
    const offset = Math.floor(strength * 5);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        
        // Red channel - shift right
        if (x + offset < width) {
          const sourceIdx = (y * width + (x + offset)) * 4;
          data[idx] = tempData[sourceIdx];
        }
        
        // Green channel - no shift (center)
        data[idx + 1] = tempData[idx + 1];
        
        // Blue channel - shift left
        if (x - offset >= 0) {
          const sourceIdx = (y * width + (x - offset)) * 4;
          data[idx + 2] = tempData[sourceIdx + 2];
        }
      }
    }
  };

  const applyDisplacement = (imageData: ImageData, strength: number, progress: number) => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const tempData = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const displacementX = Math.sin(y * 0.1 + progress * Math.PI * 2) * strength;
        const displacementY = Math.cos(x * 0.1 + progress * Math.PI * 2) * strength;
        
        const sourceX = Math.floor(x + displacementX);
        const sourceY = Math.floor(y + displacementY);
        
        if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
          const sourceIdx = (sourceY * width + sourceX) * 4;
          const targetIdx = (y * width + x) * 4;
          
          data[targetIdx] = tempData[sourceIdx];
          data[targetIdx + 1] = tempData[sourceIdx + 1];
          data[targetIdx + 2] = tempData[sourceIdx + 2];
          data[targetIdx + 3] = tempData[sourceIdx + 3];
        }
      }
    }
  };

  const applyVHSDistortion = (imageData: ImageData, intensity: number, progress: number) => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Horizontal line shifts (VHS tracking errors)
    for (let y = 0; y < height; y++) {
      if (Math.random() < intensity * 0.1) {
        const shift = Math.floor((Math.random() - 0.5) * width * intensity);
        const tempLine = new Uint8ClampedArray(width * 4);
        
        // Copy line
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          tempLine[x * 4] = data[idx];
          tempLine[x * 4 + 1] = data[idx + 1];
          tempLine[x * 4 + 2] = data[idx + 2];
          tempLine[x * 4 + 3] = data[idx + 3];
        }
        
        // Shift and wrap
        for (let x = 0; x < width; x++) {
          let sourceX = (x - shift + width) % width;
          const sourceIdx = sourceX * 4;
          const targetIdx = (y * width + x) * 4;
          
          data[targetIdx] = tempLine[sourceIdx];
          data[targetIdx + 1] = tempLine[sourceIdx + 1];
          data[targetIdx + 2] = tempLine[sourceIdx + 2];
          data[targetIdx + 3] = tempLine[sourceIdx + 3];
        }
      }
    }

    // Add chromatic aberration
    const offset = Math.floor(intensity * 5 * Math.sin(progress * Math.PI * 4));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (x + offset < width && x + offset >= 0) {
          const sourceIdx = (y * width + (x + offset)) * 4;
          data[idx] = data[sourceIdx]; // Red channel shifted
        }
      }
    }
  };

  const applyDatamosh = (imageData: ImageData, amount: number) => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Create macro blocks and duplicate/shift them
    const blockSize = 16;
    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        if (Math.random() < amount * 0.3) {
          // Pick a random source block
          const sourceX = Math.floor(Math.random() * (width - blockSize));
          const sourceY = Math.floor(Math.random() * (height - blockSize));
          
          // Copy block
          for (let by = 0; by < blockSize && y + by < height; by++) {
            for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
              const sourceIdx = ((sourceY + by) * width + (sourceX + bx)) * 4;
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

  const applyColorGrade = (imageData: ImageData, params: { contrast?: number; brightness?: number; saturation?: number }) => {
    const data = imageData.data;
    const { contrast = 1, brightness = 0, saturation = 1 } = params;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply brightness
      r += brightness * 255;
      g += brightness * 255;
      b += brightness * 255;

      // Apply contrast
      r = ((r / 255 - 0.5) * contrast + 0.5) * 255;
      g = ((g / 255 - 0.5) * contrast + 0.5) * 255;
      b = ((b / 255 - 0.5) * contrast + 0.5) * 255;

      // Apply saturation
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
      r = gray + (r - gray) * saturation;
      g = gray + (g - gray) * saturation;
      b = gray + (b - gray) * saturation;

      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
  };

  // Animation loop
  useEffect(() => {
    if (!isAnimating || !sourceImageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let startTime = Date.now();
    const duration = config.duration * 1000;

    const animate = () => {
      if (!sourceImageRef.current) return;

      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;

      // Draw source image
      ctx.drawImage(sourceImageRef.current, 0, 0);
      
      // Get image data for manipulation
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Apply effects based on active shader modules
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

      if (config.shaderModules.includes('pixelate') && config.params.pixelSize) {
        // Pixelation effect
        const size = Math.floor(config.params.pixelSize);
        for (let y = 0; y < canvas.height; y += size) {
          for (let x = 0; x < canvas.width; x += size) {
            const idx = (y * canvas.width + x) * 4;
            const r = imageData.data[idx];
            const g = imageData.data[idx + 1];
            const b = imageData.data[idx + 2];
            
            for (let dy = 0; dy < size && y + dy < canvas.height; dy++) {
              for (let dx = 0; dx < size && x + dx < canvas.width; dx++) {
                const i = ((y + dy) * canvas.width + (x + dx)) * 4;
                imageData.data[i] = r;
                imageData.data[i + 1] = g;
                imageData.data[i + 2] = b;
              }
            }
          }
        }
      }

      // New advanced effects
      if (config.shaderModules.includes('displacement') && config.params.displacementStrength) {
        applyDisplacement(imageData, config.params.displacementStrength, progress);
      }

      if (config.shaderModules.includes('vhsDistortion') && config.params.vhsIntensity) {
        applyVHSDistortion(imageData, config.params.vhsIntensity, progress);
      }

      if (config.shaderModules.includes('datamosh') && config.params.datamoshAmount) {
        applyDatamosh(imageData, config.params.datamoshAmount);
      }

      if (config.shaderModules.includes('colorGrade')) {
        applyColorGrade(imageData, {
          contrast: config.params.contrast,
          brightness: config.params.brightness,
          saturation: config.params.saturation,
        });
      }

      if (config.shaderModules.includes('chromaticAberration') && config.params.aberrationStrength) {
        applyChromaticAberration(imageData, config.params.aberrationStrength);
      }

      // Put modified image data back
      ctx.putImageData(imageData, 0, 0);

      // Record performance metrics
      getPerformanceMonitor().recordFrame();

      if (config.loop || progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config, isAnimating]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain rounded-lg"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {!config.imageSource && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">🖼️</div>
            <p>Upload an image to start glitching</p>
          </div>
        </div>
      )}
    </div>
  );
}
