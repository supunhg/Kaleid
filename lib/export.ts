import { GlitchConfig } from '@/types/glitch';

export class GlitchExporter {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sourceImage: HTMLImageElement | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
  }

  async loadImage(imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.sourceImage = img;
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        resolve();
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  private applyGlitchEffects(imageData: ImageData, config: GlitchConfig, progress: number) {
    // Copy glitch effect implementations from GlitchCanvas
    const data = imageData.data;
    const width = imageData.width;

    if (config.shaderModules.includes('rgbSplit') && config.params.splitDistance) {
      const amount = config.params.splitDistance * (1 + Math.sin(progress * Math.PI * 2));
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
    }

    if (config.shaderModules.includes('noise') && config.params.noiseIntensity) {
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < config.params.noiseIntensity * 0.1) {
          const noise = (Math.random() - 0.5) * 255;
          data[i] += noise;
          data[i + 1] += noise;
          data[i + 2] += noise;
        }
      }
    }
  }

  async exportGIF(config: GlitchConfig, fps: number = 30): Promise<Blob> {
    if (!this.sourceImage) {
      throw new Error('No image loaded');
    }

    // For GIF export, we'd need a library like gif.js
    // For now, return a placeholder
    throw new Error('GIF export requires additional library integration');
  }

  async exportMP4(config: GlitchConfig, duration: number, fps: number = 30): Promise<Blob> {
    if (!this.sourceImage) {
      throw new Error('No image loaded');
    }

    return new Promise((resolve, reject) => {
      const stream = this.canvas.captureStream(fps);
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000,
      });

      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        resolve(blob);
      };

      this.mediaRecorder.onerror = reject;

      // Start recording
      this.mediaRecorder.start(100);

      // Animate for the duration
      let startTime = Date.now();
      const totalFrames = duration * fps;
      let frameCount = 0;

      const animate = () => {
        if (frameCount >= totalFrames) {
          this.mediaRecorder?.stop();
          return;
        }

        const progress = frameCount / totalFrames;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.sourceImage!, 0, 0);
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.applyGlitchEffects(imageData, config, progress);
        this.ctx.putImageData(imageData, 0, 0);

        frameCount++;
        setTimeout(() => requestAnimationFrame(animate), 1000 / fps);
      };

      animate();
    });
  }

  async exportImage(config: GlitchConfig, frame: number = 0): Promise<Blob> {
    if (!this.sourceImage) {
      throw new Error('No image loaded');
    }

    const progress = frame;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.sourceImage, 0, 0);
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.applyGlitchEffects(imageData, config, progress);
    this.ctx.putImageData(imageData, 0, 0);

    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png');
    });
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
