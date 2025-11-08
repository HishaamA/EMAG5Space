import React, { useEffect, useRef } from 'react';
import { View, Text, Platform } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import GlobalStyles, { colors } from '../styles/GlobalStyles';

const ModelViewerScreen = () => {
  const timeoutRef = useRef(null);

  const onContextCreate = async (gl) => {
    // Create renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x0a0a1a, 1); // Dark background

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create spacecraft (sphere with metallic material)
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x007aff, // Primary blue color
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x003366,
      emissiveIntensity: 0.3,
    });
    const spacecraft = new THREE.Mesh(geometry, material);
    scene.add(spacecraft);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x64d2ff, 0.5);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Animation loop
    const render = () => {
      timeoutRef.current = requestAnimationFrame(render);

      // Rotate the spacecraft
      spacecraft.rotation.x += 0.005;
      spacecraft.rotation.y += 0.01;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        cancelAnimationFrame(timeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>EMA Spacecraft</Text>
      <Text style={[GlobalStyles.bodyText, { marginBottom: 16 }]}>
        3D Model Viewer - Interactive
      </Text>

      <View style={[GlobalStyles.card, { height: 400, overflow: 'hidden' }]}>
        {Platform.OS === 'web' ? (
          <View style={{ justifyContent: 'center', alignItems: 'center', padding: 40, flex: 1 }}>
            <Text style={[GlobalStyles.bodyText, { textAlign: 'center', color: colors.textSecondary, fontSize: 60 }]}>
              🚀
            </Text>
            <Text style={[GlobalStyles.bodyText, { textAlign: 'center', marginTop: 16, fontSize: 16, fontWeight: '600' }]}>
              3D Model Viewer
            </Text>
            <Text style={[GlobalStyles.bodyText, { textAlign: 'center', marginTop: 8, fontSize: 14 }]}>
              Interactive 3D spacecraft model available on mobile devices.{'\n\n'}
              Use the Expo Go app on your phone to view the rotating 3D model.
            </Text>
          </View>
        ) : (
          <GLView
            style={{ flex: 1 }}
            onContextCreate={onContextCreate}
          />
        )}
      </View>

      <View style={[GlobalStyles.card, { marginTop: 16 }]}>
        <Text style={GlobalStyles.label}>Model Information</Text>
        {Platform.OS !== 'web' ? (
          <View>
            <Text style={[GlobalStyles.bodyText, { marginTop: 8, fontWeight: '600', color: colors.info }]}>
              ✨ Auto-rotating 3D model
            </Text>
            <Text style={[GlobalStyles.bodyText, { marginTop: 8 }]}>
              • Metallic spacecraft sphere{'\n'}
              • Real-time rendering{'\n'}
              • Dynamic lighting effects{'\n'}
              • Powered by Three.js + WebGL
            </Text>
          </View>
        ) : (
          <Text style={[GlobalStyles.bodyText, { marginTop: 8 }]}>
            3D rendering is optimized for mobile devices using native WebGL acceleration.
          </Text>
        )}
        <Text style={[GlobalStyles.bodyText, { marginTop: 12, color: colors.textSecondary, fontSize: 12 }]}>
          This is a placeholder sphere model. In production, this would display a detailed 3D model
          of the EMA spacecraft with accurate geometry, textures, and animations.
        </Text>
      </View>
    </View>
  );
};

export default ModelViewerScreen;
