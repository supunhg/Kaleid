// Glitch Configuration Types
export interface GlitchConfig {
  effectName: string;
  duration: number;
  loop: boolean;
  reverse: boolean;
  quality: 'low' | 'medium' | 'high';
  shapes: ShapeType[];
  shaderModules: ShaderModule[];
  params: GlitchParams;
  imageSource?: string; // URL or data URL for uploaded image
  renderMode: 'text' | 'image'; // Switch between text and image rendering
}

export type ShapeType = 'circle' | 'rectangle' | 'strips' | 'custom';

export type ShaderModule = 
  | 'noise'
  | 'rgbSplit'
  | 'chromaticAberration'
  | 'pixelate'
  | 'scanlines'
  | 'glitchBlocks'
  | 'displacement'
  | 'vhsDistortion'
  | 'datamosh'
  | 'colorGrade';

export interface GlitchParams {
  noiseIntensity?: number;
  splitDistance?: number;
  aberrationStrength?: number;
  pixelSize?: number;
  scanlineOpacity?: number;
  blockSize?: number;
  colorShift?: number;
  distortionAmount?: number;
  displacementStrength?: number;
  vhsIntensity?: number;
  datamoshAmount?: number;
  contrast?: number;
  brightness?: number;
  saturation?: number;
}

// User & Database Types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Creation {
  id: string;
  user_id: string;
  config: GlitchConfig;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

// Preset Types
export interface GlitchPreset {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  config: GlitchConfig;
  category: 'text' | 'shapes' | 'advanced' | 'artistic';
}
