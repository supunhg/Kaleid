'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGlitchStore } from '@/lib/store';
import { glitchVertexShader, glitchFragmentShader } from '@/shaders/glitchShader';

export default function WebGLRenderer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const textureRef = useRef<THREE.Texture | null>(null);
  
  const { config } = useGlitchStore();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        containerRef.current?.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Load image texture
  useEffect(() => {
    if (!config.imageSource || !sceneRef.current) return;

    const loader = new THREE.TextureLoader();
    loader.load(config.imageSource, (texture) => {
      textureRef.current = texture;

      // Create shader material
      const material = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: texture },
          time: { value: 0 },
          glitchIntensity: { value: config.params.noiseIntensity || 0 },
          rgbShift: { value: config.params.splitDistance || 0 },
          scanlineIntensity: { value: config.params.scanlineOpacity || 0 },
          resolution: { value: new THREE.Vector2(texture.image.width, texture.image.height) },
        },
        vertexShader: glitchVertexShader,
        fragmentShader: glitchFragmentShader,
      });

      materialRef.current = material;

      // Create plane geometry
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      
      // Clear previous meshes
      while (sceneRef.current!.children.length > 0) {
        sceneRef.current!.remove(sceneRef.current!.children[0]);
      }
      
      sceneRef.current!.add(mesh);

      // Start animation
      startAnimation();
    });
  }, [config.imageSource]);

  // Update shader uniforms when config changes
  useEffect(() => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.glitchIntensity.value = config.params.noiseIntensity || 0;
    materialRef.current.uniforms.rgbShift.value = (config.params.splitDistance || 0) / 10;
    materialRef.current.uniforms.scanlineIntensity.value = config.params.scanlineOpacity || 0;
  }, [config.params]);

  const startAnimation = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      if (materialRef.current) {
        materialRef.current.uniforms.time.value = elapsed;
      }

      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  return (
    <div ref={containerRef} className="w-full h-full">
      {!config.imageSource && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">🎨</div>
            <p>Upload an image to see WebGL effects</p>
          </div>
        </div>
      )}
    </div>
  );
}
