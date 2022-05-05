import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import "./stylesheets/App.css";

function Test() {
    return (
       <Canvas dpr={[1, 1.5]} shadows camera={{ position: [1, 0, 90], fov: 35 }} gl={{ alpha: false }}>
          <ambientLight />
          <spotLight intensity={0.3} position={[5, 10, 50]} />
          <mesh>
             <boxGeometry attach="geometry" args={[3, 2, 1]} />
             <meshPhongMaterial attach="material" color="hotpink" />
          </mesh>
       </Canvas>
    );
};

export default Test;