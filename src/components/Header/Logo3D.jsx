import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Logo3D({ imageSrc, width, height }) {
  const containerRef = useRef(null);
  const frameId = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      imageSrc,
      (texture) => {
        const aspect = texture.image.width / texture.image.height;
        const geometry = new THREE.PlaneGeometry(aspect * 1.5, 1.5);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        meshRef.current = mesh;
        scene.add(mesh);
      },
      undefined,
      (error) => {
        console.error('Erro ao carregar textura do logotipo:', error);
      }
    );

    let paused = false;
    const animate = () => {
      frameId.current = requestAnimationFrame(animate);
      if (meshRef.current && !paused) {
        meshRef.current.rotation.y += 0.015;
      }
      renderer.render(scene, camera);
    };

    const resize = () => {
      if (!container) return;
      const w = container.clientWidth || width;
      const h = container.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const handleMouseEnter = () => { paused = true; };
    const handleMouseLeave = () => { paused = false; };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);

    animate();

    return () => {
      cancelAnimationFrame(frameId.current);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
        }
      }
      if (meshRef.current) {
        scene.remove(meshRef.current);
      }
    };
  }, [imageSrc, width, height]);

  return <div ref={containerRef} className="logo3d-canvas" style={{ width: '100%', height: '100%' }} />;
}
