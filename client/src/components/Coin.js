import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.setZ(30);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(500,500);

scene.background = new THREE.Color( 0xededed );

const geometry = new THREE.CylinderGeometry(10,10,1,100);
const material = new THREE.MeshStandardMaterial(
  {
    color:0xfadd00,
    metalness:0.9,
    roughness:0.2,
    aoMapIntensity:1,
    envMapIntensity:1,
  });
const coin = new THREE.Mesh(geometry,material);
scene.add(coin);
coin.rotation.x=90;

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,0,31);

const ambientLight = new THREE.AmbientLight(0xffffff,5);
scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera,renderer.domElement);
controls.target.set( 0, 0.5, 0 );
			controls.update();
			controls.enablePan = false;
			controls.enableDamping = true;

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
}

animate();