import React, { useState, useEffect } from "react";
import { useSpring } from 'react-spring';
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber";
import { useScroll, ScrollControls } from '@react-three/drei'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import "./stylesheets/App.css";

extend({ OrbitControls });

function Test() {

    return (
        <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 200, 400], fov: 35 }} gl={{ alpha: false }}>
            <ScrollControls distance={1} >
                <WithinTheScroll />
            </ScrollControls>
        </Canvas>
    );
};

function WithinTheScroll() {

    const [enabled, setEnabled] = useState(true)

    const orbitControls = false;
    const { camera } = useThree();

    return (
        <>
            {/* {enabled ? <Dolly camera={camera} /> : <></>} */}
            <Dolly camera={camera} />
            <ambientLight />
            <axesHelper args={[200, 200, 200]} />
            <gridHelper args={[1000, 1000, 1000]} />
            <pointLight position={[0, 0, 0]} />
            {orbitControls ? <Controls /> : <></>}
            <SkyBox />
            <mesh position={[0, 0, -1000]} rotation={[0, 0, 0]}>
                <planeBufferGeometry args={[16000, 9000]} />
                <meshMatcapMaterial color="#33C3FF" />
            </mesh>
            <spotLight intensity={0.3} position={[5, 10, 50]} />
            <Box />
            <SpikyStar position={[20, 0, 0]} camera={camera} setEnabled={setEnabled} />
        </>
    )
}

function Dolly(props) {
    const scroll = useScroll();
    useFrame(() => {
        if (props.enabled == true) {
            if (scroll.offset < 0.25) {
                props.camera.lookAt(0, 0, 0)
                props.camera.position.y = -(scroll.offset * 800) + 225;
            } else {
                props.camera.lookAt(0, 0, 0)
                props.camera.position.z = -((scroll.offset - 0.25) * 800) + 400;
            }
        }
    })
    return null;
}

function SkyBox() {
    return (
        <>
            <mesh position={[0, 0, -500]} rotation={[0, 0, 0]}>
                <planeBufferGeometry args={[16000, 9000]} />
                <meshMatcapMaterial color="skyblue" />
            </mesh>
            <mesh position={[0, -500, 0]} rotation={[270, 0, 0]}>
                <planeBufferGeometry args={[16000, 9000]} />
                <meshMatcapMaterial color="skyblue" />
            </mesh>
        </>
    )
}

function SpikyStar(props) {

    const [highlight, setHighlight] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [z, setZ] = useState(0)

    const springProps1 = useSpring({
        config: { duration: 5000 }, // , easing: easings.easeCubic },
        from: {
            x: props.camera.position.x,
            y: props.camera.position.y,
            z: props.camera.position.z,
            lookAtX: props.camera.lookAt.x - 0.1,
            lookAtY: props.camera.lookAt.y - 0.1,
            lookAtZ: props.camera.lookAt.z - 0.1,
        },
        to: {
            x: props.position[0],
            y: props.position[1],
            z: props.position[2] + 10,
            lookAtX: props.position[0],
            lookAtY: props.position[1],
            lookAtZ: 0
        }
    });

    // useFrame((state, delta) => {
    //     if (clicked) {
    //         setX(props.camera.position.x)
    //         setY(props.camera.position.y)
    //         setZ(props.camera.position.z)
    //         props.camera.position.x = springProps1.x.animation.to;
    //         props.camera.position.y = springProps1.y.animation.to;
    //         props.camera.position.z = springProps1.z.animation.to;
    //         props.camera.lookAt(
    //             springProps1.lookAtX.animation.to,
    //             springProps1.lookAtY.animation.to,
    //             springProps1.lookAtZ.animation.to
    //         )
    //     }
    // });

    function handleClicked() {
        setClicked(!clicked)
        console.log("Click is: " + !clicked)
        if (!clicked) {
            props.setEnabled(false)
            setX(props.camera.position.x)
            setY(props.camera.position.y)
            setZ(props.camera.position.z)
            console.log("Current position is x: " + props.camera.position.x + " y: " + props.camera.position.y + " z: " + props.camera.position.z)
            console.log("Set position to x: " + springProps1.x.animation.to + " y: " + springProps1.y.animation.to + " z: " + springProps1.z.animation.to);
            props.camera.position.x = springProps1.x.animation.to;
            props.camera.position.y = springProps1.y.animation.to;
            props.camera.position.z = springProps1.z.animation.to;
        } else {
            props.setEnabled(true)
            console.log("Returning position to x: " + x + " y: " + y + " z: " + z);
            props.camera.position.x = x;
            props.camera.position.y = y;
            props.camera.position.z = z;
        }
    }

    return (
        <mesh position={props.position} onClick={() => handleClicked()} onPointerOver={() => setHighlight(true)} onPointerOut={() => setHighlight(false)}>
            <torusKnotBufferGeometry attach="geometry" args={[10, 3, 100, 16, 88, 88]} />
            <meshPhongMaterial attach="material" color={highlight ? "yellow" : "hotpink"} />
        </mesh>
    )
}

function Box() {
    return (
        <mesh>
            <boxGeometry attach="geometry" args={[3, 2, 1]} />
            <meshPhongMaterial attach="material" color="hotpink" />
        </mesh>
    )
}

const Controls = () => {
    const { camera, gl } = useThree();
    // console.log("check")
    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);
            controls.minDistance = 0;
            controls.maxDistance = 2000;
            controls.target.set(0, 0, 20);
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );
    return null;
};

export default Test;