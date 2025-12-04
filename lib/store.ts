import { create } from 'zustand';
import { GlitchConfig } from '@/types/glitch';
import { useHistoryStore } from './history';

interface GlitchStore {
  config: GlitchConfig;
  setConfig: (config: Partial<GlitchConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: GlitchConfig = {
  effectName: 'Untitled Effect',
  duration: 2.0,
  loop: true,
  reverse: false,
  quality: 'medium',
  shapes: ['rectangle'],
  shaderModules: [],
  renderMode: 'image',
  imageSource: undefined,
  params: {
    noiseIntensity: 0.5,
    splitDistance: 3,
    aberrationStrength: 0.5,
    pixelSize: 4,
    scanlineOpacity: 0.3,
    blockSize: 20,
    colorShift: 0.5,
    distortionAmount: 0.5,
    displacementStrength: 0.3,
    vhsIntensity: 0.4,
    datamoshAmount: 0.2,
  },
};

export const useGlitchStore = create<GlitchStore>((set, get) => ({
  config: defaultConfig,
  setConfig: (newConfig) => {
    const prevConfig = get().config;
    
    // Deep merge params to preserve default values
    const nextConfig = {
      ...prevConfig,
      ...newConfig,
      params: {
        ...defaultConfig.params,
        ...prevConfig.params,
        ...(newConfig.params || {}),
      },
    };
    
    // Add to history before updating
    const historyStore = useHistoryStore.getState();
    historyStore.addToHistory(prevConfig);
    historyStore.setPresent(nextConfig);
    
    set({ config: nextConfig });
  },
  resetConfig: () => {
    const prevConfig = get().config;
    const historyStore = useHistoryStore.getState();
    historyStore.addToHistory(prevConfig);
    historyStore.setPresent(defaultConfig);
    
    set({ config: defaultConfig });
  },
}));
