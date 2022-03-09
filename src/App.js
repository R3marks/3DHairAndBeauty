import './stylesheets/App.css';
import { Canvas, useFrame, extend, useThree, useLoader } from '@react-three/fiber'
import React, { useState, useEffect, useRef } from "react";
import state from "./store";
import { Sky, useGLTF, useScroll, ScrollControls, Environment, Merged, Text, MeshReflectorMaterial, Html } from '@react-three/drei'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Brygada from "./Brygada.json"

extend({ OrbitControls });
extend({ TextGeometry })

function Scene() {

  var disabled = true;

  return (
    <Canvas dpr={[1, 1.5]} 
      shadows 
      camera={{ position: [0, 200, 400], fov: 35, near: 1, far: 10000, view: [100, 0, 0]}} 
      gl={{ alpha: false }}>
      {disabled ? <></> : <Controls />}
      {/* <ScrollControls pages={2}>
        <Skye />
      </ScrollControls> */}
      <ambientLight intensity={0.75} />
      {/* <perspectiveCamera position={[100, 10, -100]} args={[105, window.innerWidth / window.innerHeight, 0.1, 1000]} zoom={100} /> */}
      <ScrollControls distance={1} >
        {disabled ? <Dolly /> : <></>}
        <pointLight position={[0, 0, 0]} />
        <axesHelper args={[200, 200, 200]} />
        <gridHelper args={[1000, 1000, 1000]} />
        <SkyBox />
        <Window size={[50, 40, 5]} position={[35, 20, 200]} />
        <Window size={[50, 40, 5]} position={[-35, 20, 200]} />
        <Wall name="back" position={[0, 25, 0]} size={[120, 50, 5]} />
        <Wall name="left" position={[65, 25, 100]} size={[10, 50, 205]} />
        <Wall name="right" position={[-65, 25, 100]} size={[10, 50, 205]} />
        <Wall name="front" position={[0, 50, 200]} size={[120, 20, 5]} />
        {/* <textGeometry args={["helooo"]}>
          HELLO
        </textGeometry> */}
        <pointLight position={[0, 30, 210]} />
        {/* <pointLightHelper /> */}
        <Poster position={[-35, 20, 205]} size={[30, 30, 1]} />
        <Text3d position={[-37.5, 20, 205]} text={"Text A"} />
        <Poster position={[0, 20, 205]} size={[18, 30, 1]} />
        <Text3d position={[-7.5, 30, 205]} text={"Hello and welcome to \naperture science and \ncomputer enrichment \n \nMonday      9AM - 9PM \nTuesday.......9AM - 9PM"} />
        <Poster position={[35, 20, 205]} size={[30, 30, 1]} />
        <Text3d position={[32.5, 20, 205]} text={"Text B"} />
        {/* <Text
          scale={[10, 10, 10]}
          color="black" // default
          anchorX={50} // default
          anchorY={50}>
          HELLO WORLD
        </Text> */}
        {/* {disabled ? <TorusWithoutScroll /> :       
        <ScrollControls pages={3}>
          <TorusWithScroll />
        </ScrollControls>} */}
      </ScrollControls>
    </Canvas>
  )
}

function Dolly() {
  const x = 1;
  const y = 1;
  const posX = 1;
  const posY = 1;
  const z = 1;
  const scroll = useScroll();
  const { camera } = useThree();
  console.log(camera.position)
  useFrame(() => {
    // camera.updateProjectionMatrix(
    //   void (camera.rotation.x = 0.6 - y),
    //   (camera.rotation.y = -0.6 - x),
    //   (camera.position.x = -4 + posX),
    //   (camera.position.y = -3 + posY),
    //   (camera.rotation.z = 0.33 + z)
    //)
    if (scroll.offset < 0.25) {
      camera.lookAt(0, 0, 0)
      camera.position.y = -(scroll.offset * 800) + 225;
    } else if (scroll.offset > 0.31 && scroll.offset < 0.38) {
      camera.position.z = -((scroll.offset - 0.25) * 800) + 400;
      camera.position.x = -((scroll.offset - 0.31) * 400) - 0;
      console.log("x should be: " + camera.position.x)
    } else {
      camera.lookAt(0, 0, 0)
      console.log("Z: " + camera.position.z)
      camera.position.z = -((scroll.offset - 0.25) * 800) + 400;
    }
    console.log(scroll.offset);
  })
  return null;
}

const Controls = () => {
  const { camera, gl } = useThree();
  console.log("check")
  useEffect(
     () => {
        const controls = new OrbitControls(camera, gl.domElement);
        controls.minDistance = -2000;
        controls.maxDistance = 2000;
        controls.target.set(0, 0, 200);
        return () => {
          controls.dispose();
        };
     },
     [camera, gl]
  );
  return null;
};

function Skye() {

  const ref = useRef();
  const scroll = useScroll();
  // useEffect(() => {
  //   ref.current.distance = scroll.offset * 10000;
  //   console.log(ref.current.distance);
  // })

  return (
    <group >
      <Sky
        distance={4000}
        sunPosition={[0, 1, 10]}
        inclination={0}
        azimuth={0.75}
        // mieCoefficient={0.2}
        // mieDirectionalG={0.8}
        // rayleigh={0.3}
        // turbidity={55}
      />
      </group>
  );
}

function SkyBox() {
  return (
    <mesh position={[0, 0, -1000]} rotation={[0, 0, 0]}>
      <planeBufferGeometry args={[16000, 9000]} />
      <meshMatcapMaterial color="#33C3FF" /> 
    </mesh>
  )
}

function Text3d(props) {
  const font = new FontLoader().parse(Brygada);
  //const font = useLoader(FontLoader, Brygada)
  const textOptions = {
     font,
     size: 1,
     height: 1,
     curveSegments: 12,
     bevelEnabled: true,
     bevelThickness: 0.01,
     bevelSize: 0.025,
     bevelOffset: 0,
     bevelSegments: 5
  };
  return (
     <mesh position={props.position}>
        <textGeometry attach='geometry' args={[props.text, textOptions]} />
        <meshStandardMaterial attach='material' color="black" />
      </mesh>
   )
}

function Poster(props) {
  return (
    <mesh position={props.position} >
      <boxGeometry args={props.size} />
      <meshStandardMaterial color="white" />
    </mesh>
  )
}

function Window(props) {
  return (
    <mesh position={props.position}>
      <boxGeometry args={props.size} />
      <meshPhysicalMaterial 
      color="lightblue"
      metalness={0.9}
      roughness={0.95}
      thickness={0.5}
      envMapIntensity={0.9}
      clearcoat={1}
      transparent={true}
      transmission={0.5}
      opacity={.5}
      reflectivity={0.2}
      refractionRatio={0.985}
      ior={0.9} />
    </mesh>
  )
}

function Wall(props) {
  return (
    <mesh position={props.position}>
      <boxGeometry args={props.size} />
      <meshStandardMaterial color="brown" />
    </mesh>
  )
}

function TorusWithScroll() {

  const ref = useRef()
  const rot = useRef()
  const rot1 = useRef()
  const rot2 = useRef()
  const scroll = useScroll()
  // const [cabin, seat] = useGLTF(['/cabin-transformed.glb', '/seat-transformed.glb'])
  // const meshes = useMemo(() => ({ Cabin: cabin.nodes.cabin_1, Seat: seat.nodes.seat }), [cabin, seat])
  useFrame(() => {
    // console.log(rot)
    if (scroll.offset < 0.20) {
      ref.current.position.y = scroll.offset * 120;
    } else {
      ref.current.position.z = (scroll.offset * 120) - 24;
      rot.current.rotation.x = scroll.offset * 20;
      //rot.current.rotation.y = 0;
      //rot.current.rotation.z = 0;
    }
    // console.log("scroll offset: " + scroll.offset * 120)}
  });

  return (
    <group ref={ref}>
      <mesh ref={rot}>
        <torusGeometry ref={rot1} rotateX={45} args={[10, 3, 16, 100]} />
        <meshStandardMaterial ref={rot2} color="orange" />
      </mesh>
    </group>
  )
}

function TorusWithoutScroll() {
  return (
    <group position={[0, 0, -200]}>
      <mesh>
        <torusGeometry args={[10, 3, 16, 100]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  )
}


function App() {
  
  // const scrollArea = useRef();
  // const onScroll = e => (state.top.current = e.target.scrollTop);
  // useEffect(() => void onScroll({ target: scrollArea.current }), []);

  return (
    <>
    <Scene />
    {/* <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
      <div style={{ height: `${state.pages * 100}vh` }} />
    </div> */}
    </>
  )
}


// import Header from "./components/header";
// import { Section } from "./components/section";

// import {Html, PerspectiveCamera, RoundedBox} from '@react-three/drei';
// import { TorusGeometry } from 'three';
// import { MeshStandardMaterial } from 'three';
// import { AmbientLight } from 'three';

// function Sphere() {
//   return (        
//     <mesh >
//         <sphereBufferGeometry 
// 			attach="geometry"
// 			args={[2, 30, 30]} />
//         <meshStandardMaterial 
// 			attach="material" 
// 			position={[100, 100, 0]} 
//          	color="hotpink" />
//     </mesh>)
// };

// function HTMLContent() {
//   return (
//     <Html fullscreen>
//       <div className="title">
//         Hello
//       </div>
//     </Html>
//   );
// };

// function App() {
//   return (
//     <div>
//       <Canvas className='canvas'>
//       <ambientLight intensity={0.1} />
//         <group>
//           <mesh>
//             <meshStandardMaterial color="orange" />
//             <torusGeometry args={[10, 3, 16, 100]} />
//           </mesh>
//         </group>
//       </Canvas>
//     </div>
//   )
// }

// function App() {
//   return (
//     <>
//     <Header />
//       <div className="canvas-container">
//         <Canvas
//           colorManagement>
//             <PerspectiveCamera args={[75, window.innerWidth / window.innerHeight, 0.1, 1000]} />
//             <HTMLContent />
//             <mesh>
//               <TorusGeometry attach="material" args={[10, 3, 16, 100]} />
//               <MeshStandardMaterial attach="geometry" color="0xFF6437" />
//             </mesh>
//             <AmbientLight />
//             {/* <RoundedBox
//               args={[10, 10, 10]}
//               radius={0.05}
//               smoothness={4}>
//                 <meshPhongMaterial attach="material" color="#f3f3f3" wireframe />
//               </RoundedBox>
//           <ambientLight intensity={0.2} />
//           <directionalLight color="white" position={[0, 0, 1]} />
//             <Sphere /> */}
//         </Canvas>
//       </div>
//     </>
//   );
// };

export default App;
