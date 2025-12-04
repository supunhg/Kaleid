// Performance monitoring and optimization utilities

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  renderTime: number;
  memoryUsage: number | undefined;
}

export class PerformanceMonitor {
  private fpsHistory: number[] = [];
  private frameTimeHistory: number[] = [];
  private lastFrameTime: number = performance.now();
  private frameCount: number = 0;
  private readonly maxHistorySize = 60; // Track last 60 frames (1 second at 60fps)

  recordFrame() {
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > this.maxHistorySize) {
      this.frameTimeHistory.shift();
    }

    this.frameCount++;
    const fps = 1000 / frameTime;
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > this.maxHistorySize) {
      this.fpsHistory.shift();
    }
  }

  getMetrics(): PerformanceMetrics {
    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length || 0;
    const avgFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length || 0;

    let memoryUsage: number | undefined;
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }

    return {
      fps: Math.round(avgFps),
      frameTime: Math.round(avgFrameTime * 100) / 100,
      renderTime: this.lastFrameTime,
      memoryUsage,
    };
  }

  reset() {
    this.fpsHistory = [];
    this.frameTimeHistory = [];
    this.frameCount = 0;
  }
}

// Throttle function to limit execution rate
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, delay - (now - lastCall));
    }
  };
}

// Debounce function to delay execution until after calls have stopped
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Batch canvas operations together
export class CanvasOperationBatcher {
  private operations: (() => void)[] = [];
  private rafId: number | null = null;

  addOperation(operation: () => void) {
    this.operations.push(operation);
    this.scheduleFlush();
  }

  private scheduleFlush() {
    if (this.rafId !== null) return;

    this.rafId = requestAnimationFrame(() => {
      this.flush();
    });
  }

  private flush() {
    const ops = this.operations.splice(0);
    ops.forEach((op) => op());
    this.rafId = null;
  }

  clear() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.operations = [];
  }
}

// Memoization utility for expensive calculations
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  maxCacheSize = 10
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);

    // Limit cache size
    if (cache.size > maxCacheSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    return result;
  }) as T;
}

// Use requestIdleCallback for non-critical work
export function scheduleIdleWork(callback: () => void, timeout = 1000) {
  if ('requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for browsers without requestIdleCallback
    return setTimeout(callback, 0);
  }
}

export function cancelIdleWork(id: number) {
  if ('cancelIdleCallback' in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}
