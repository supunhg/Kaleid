// Web Worker for offloading heavy canvas operations
const ctx: Worker = self as any;

interface GlitchMessage {
  type: 'process';
  imageData: ImageData;
  effects: string[];
  params: any;
  progress: number;
}

ctx.addEventListener('message', (event: MessageEvent<GlitchMessage>) => {
  const { type, imageData, effects, params, progress } = event.data;

  if (type === 'process') {
    try {
      const processedData = applyEffects(imageData, effects, params, progress);
      ctx.postMessage({ type: 'result', imageData: processedData }, [processedData.data.buffer]);
    } catch (error) {
      ctx.postMessage({ type: 'error', error: (error as Error).message });
    }
  }
});

function applyEffects(
  imageData: ImageData,
  effects: string[],
  params: any,
  progress: number
): ImageData {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // RGB Split
  if (effects.includes('rgbSplit') && params.splitDistance) {
    const amount = params.splitDistance * (1 + Math.sin(progress * Math.PI * 2));
    const offset = Math.floor(amount);

    const tempData = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        
        // Shift red channel
        if (x + offset < width) {
          const targetIdx = (y * width + (x + offset)) * 4;
          data[targetIdx] = tempData[idx];
        }
        
        // Shift blue channel
        if (x - offset >= 0) {
          const targetIdx = (y * width + (x - offset)) * 4;
          data[targetIdx + 2] = tempData[idx + 2];
        }
      }
    }
  }

  // Noise
  if (effects.includes('noise') && params.noiseIntensity) {
    const intensity = params.noiseIntensity * 0.1;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < intensity) {
        const noise = (Math.random() - 0.5) * 255;
        data[i] += noise;
        data[i + 1] += noise;
        data[i + 2] += noise;
      }
    }
  }

  // Block Glitch
  if (effects.includes('glitchBlocks') && params.blockSize) {
    const blockSize = params.blockSize;
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
  }

  // Scanlines
  if (effects.includes('scanlines') && params.scanlineOpacity) {
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        data[idx] *= (1 - params.scanlineOpacity);
        data[idx + 1] *= (1 - params.scanlineOpacity);
        data[idx + 2] *= (1 - params.scanlineOpacity);
      }
    }
  }

  return imageData;
}

export {};
