export function useWebWorker() {
  const workerRef = typeof window !== 'undefined' 
    ? new Worker(new URL('../workers/glitch.worker.ts', import.meta.url))
    : null;

  const processImageWithWorker = (
    imageData: ImageData,
    effects: string[],
    params: any,
    progress: number
  ): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      if (!workerRef) {
        reject(new Error('Web Worker not supported'));
        return;
      }

      workerRef.onmessage = (event) => {
        if (event.data.type === 'result') {
          resolve(event.data.imageData);
        } else if (event.data.type === 'error') {
          reject(new Error(event.data.error));
        }
      };

      workerRef.onerror = (error) => {
        reject(error);
      };

      workerRef.postMessage(
        {
          type: 'process',
          imageData,
          effects,
          params,
          progress,
        },
        [imageData.data.buffer]
      );
    });
  };

  const terminateWorker = () => {
    workerRef?.terminate();
  };

  return { processImageWithWorker, terminateWorker };
}
