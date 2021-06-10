// import React, { useRef, useState } from 'react'
// import ReactDOM from 'react-dom'
// import { Canvas, useFrame } from '@react-three/fiber'

// function Coin(props) {
//   // This reference will give us direct access to the mesh
//   const mesh = useRef()
//   // Set up state for the hovered and active state
//   const [hovered, setHover] = useState(false)
//   const [active, setActive] = useState(false)
//   // Rotate mesh every frame, this is outside of React without overhead
//   useFrame(() => (mesh.current.rotation.x += 0.01))

//   return (
//     <mesh
//       {...props}
//       ref={mesh}
//       scale={active ? 1.5 : 1}
//       onClick={(event) => setActive(!active)}
//       onPointerOver={(event) => setHover(true)}
//       onPointerOut={(event) => setHover(false)}>
//       <boxGeometry args={[1, 2, 3]} />
//       <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//     </mesh>
//   )
// }

// export default Coin;

// ReactDOM.render(
//   <Canvas>
//     <ambientLight />
//     <pointLight position={[10, 10, 10]} />
//     <Coin position={[-1.2, 0, 0]} />
//     <Coin position={[1.2, 0, 0]} />
//   </Canvas>,
//   document.getElementById('root'),
// )