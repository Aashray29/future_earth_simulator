import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { City, Policies } from '../types';

interface EarthProps {
  policies: Policies;
  futureMode: boolean;
  cities: City[];
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
}

const getVertex = (lat: number, lng: number, radius: number = 2.5) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

export function Earth3D({ policies, futureMode, cities, selectedCity, onSelectCity }: EarthProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const onSelectCityRef = useRef(onSelectCity);
  
  useEffect(() => {
    onSelectCityRef.current = onSelectCity;
  }, [onSelectCity]);
  
  // Store projected city positions for HTML overlays
  const [cityPositions, setCityPositions] = useState<Array<{id: string, name: string, x: number, y: number, zIndex: number, visible: boolean}>>([]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const cityMeshesRef = useRef<THREE.Mesh[]>([]);
  const materialsRef = useRef<any>({});
  
  // Create shared geometries and materials outside the effect so they can be cleaned up
  const cityGeoRef = useRef<THREE.SphereGeometry | null>(null);
  const cityMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 3.5;
    controls.maxDistance = 12;
    controls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight1.position.set(10, 10, 5);
    scene.add(dirLight1);
    
    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1);
    dirLight2.position.set(-10, -10, -5);
    scene.add(dirLight2);

    // Globe Group
    const globe = new THREE.Group();
    globe.rotation.y = -Math.PI / 2.5;
    scene.add(globe);
    globeRef.current = globe;

    // Geometries
    const sphereGeo = new THREE.SphereGeometry(2.5, 64, 64);
    const wireGeo = new THREE.SphereGeometry(2.51, 32, 32);
    const smogGeo = new THREE.SphereGeometry(2.55, 32, 32);
    const tempGeo = new THREE.SphereGeometry(2.62, 32, 32);

    // Materials
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8, metalness: 0.2 });
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
    const smogMat = new THREE.MeshStandardMaterial({ color: 0x78716c, transparent: true, opacity: 0, blending: THREE.NormalBlending, depthWrite: false });
    const tempMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    
    materialsRef.current = { baseMat, wireMat, smogMat, tempMat };

    globe.add(new THREE.Mesh(sphereGeo, baseMat));
    globe.add(new THREE.Mesh(wireGeo, wireMat));
    globe.add(new THREE.Mesh(smogGeo, smogMat));
    globe.add(new THREE.Mesh(tempGeo, tempMat));

    // Prepare city geometry/material refs
    cityGeoRef.current = new THREE.SphereGeometry(0.04, 16, 16);
    cityMatRef.current = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: PointerEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cityMeshesRef.current);
      
      if (intersects.length > 0) {
        setHoveredCity(intersects[0].object.userData.id);
        document.body.style.cursor = 'pointer';
      } else {
        setHoveredCity(null);
        document.body.style.cursor = 'auto';
      }
    };

    const onClick = (e: MouseEvent) => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cityMeshesRef.current);
      if (intersects.length > 0) {
        const meshCity = intersects[0].object.userData.city;
        if (meshCity) onSelectCityRef.current(meshCity);
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('click', onClick);

    let animationFrameId: number;
    const tempV = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      controls.update();
      renderer.render(scene, camera);

      // Update HTML positions
      const newPos: typeof cityPositions = [];
      const halfW = width / 2;
      const halfH = height / 2;

      // We only project if globe exists and camera exists
      if (globe && camera) {
        cityMeshesRef.current.forEach(mesh => {
          tempV.copy(mesh.position);
          tempV.applyMatrix4(globe.matrixWorld);
          
          // Check if behind globe (simple distance check)
          const dist = camera.position.distanceTo(tempV);
          const isVisible = dist < 8.5; // Roughly the visible face threshold

          tempV.project(camera);
          
          newPos.push({
            id: mesh.userData.id,
            name: mesh.userData.name,
            x: (tempV.x * halfW) + halfW,
            y: -(tempV.y * halfH) + halfH,
            zIndex: isVisible ? 100 : 0,
            visible: isVisible && tempV.z < 1
          });
        });
        setCityPositions(newPos);
      }
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('click', onClick);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = 'auto';
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      
      // Cleanup geometries and materials
      sphereGeo.dispose();
      wireGeo.dispose();
      smogGeo.dispose();
      tempGeo.dispose();
      baseMat.dispose();
      wireMat.dispose();
      smogMat.dispose();
      tempMat.dispose();
      
      if (cityGeoRef.current) cityGeoRef.current.dispose();
      if (cityMatRef.current) cityMatRef.current.dispose();
    };
  }, []); // Setup once

  // Handle dynamic cities rendering
  useEffect(() => {
    if (!globeRef.current || !cityGeoRef.current || !cityMatRef.current) return;

    // Remove existing
    cityMeshesRef.current.forEach(mesh => {
      globeRef.current?.remove(mesh);
    });
    cityMeshesRef.current = [];

    // Add new
    cities.forEach(city => {
      const pos = getVertex(city.lat, city.lng, 2.52);
      const mesh = new THREE.Mesh(cityGeoRef.current!, cityMatRef.current!.clone());
      mesh.position.copy(pos);
      mesh.userData = { id: city.id, name: city.name, city };
      globeRef.current?.add(mesh);
      cityMeshesRef.current.push(mesh);
    });
  }, [cities]); // Triggered when cities array changes

  // Update materials based on props
  useEffect(() => {
    if (!materialsRef.current || !globeRef.current || !materialsRef.current.baseMat) return;
    
    const evFactor = policies.ev / 100;
    const renewableFactor = policies.renewable / 100;
    const transportFactor = policies.publicTransport / 100;
    const treesFactor = policies.trees / 10000000;
    
    const cleanEnergy = (evFactor + renewableFactor + transportFactor) / 3;
    const smogLevel = Math.max(0, 1 - cleanEnergy * 1.5);
    const tempLevel = Math.max(0, 1 - (cleanEnergy * 1.2 + treesFactor * 0.5));
    const natureLevel = Math.min(1, treesFactor * 1.5 + cleanEnergy * 0.5);

    const c = new THREE.Color('#0f172a');
    const green = new THREE.Color('#10b981');
    const cyan = new THREE.Color('#06b6d4');
    c.lerp(green, natureLevel * 0.5);
    if (futureMode) c.lerp(cyan, 0.4);

    materialsRef.current.baseMat.color = c;
    materialsRef.current.wireMat.color = futureMode ? cyan : green;
    materialsRef.current.wireMat.opacity = 0.15 + (natureLevel * 0.1);
    materialsRef.current.smogMat.opacity = smogLevel * 0.7;
    materialsRef.current.tempMat.opacity = tempLevel * 0.4;

    // Update marker colors and scales
    globeRef.current.children.forEach(child => {
      if (child.userData && child.userData.id) {
        const isSelected = selectedCity?.id === child.userData.id;
        const isHover = hoveredCity === child.userData.id;
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        
        if (isSelected) {
          mat.color.setHex(0x34d399);
          mesh.scale.setScalar(2);
        } else if (isHover) {
          mat.color.setHex(0x6ee7b7);
          mesh.scale.setScalar(1.5);
        } else {
          mat.color.setHex(0x94a3b8);
          mesh.scale.setScalar(1);
        }
      }
    });
  }, [policies, futureMode, selectedCity, hoveredCity]);

  return (
    <div className="w-full h-full relative" ref={mountRef}>
      {/* HTML Overlays for Cities */}
      {cityPositions.map(pos => {
        const isSelected = selectedCity?.id === pos.id;
        const isHovered = hoveredCity === pos.id;
        const showTooltip = (isSelected || isHovered) && pos.visible;

        if (!showTooltip) return null;

        return (
          <div 
            key={pos.id}
            className={`absolute px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-opacity duration-300 shadow-xl border backdrop-blur-md pointer-events-none -translate-x-1/2 mt-4
              opacity-100 bg-slate-900/90 text-emerald-400 border-emerald-500/50`}
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              zIndex: pos.zIndex,
            }}
          >
            {pos.name}
          </div>
        );
      })}
    </div>
  );
}
