// main.js

// Import Three.js core and necessary extensions
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

// Import GSAP for animations
import { gsap } from 'gsap';

// Scene and Camera Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(5, 5, 10);

// Renderer Setup
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('three-canvas'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Overlay Element
const overlay = document.getElementById('overlay');

// Function to update overlay content
function updateOverlay(content, heading = 'h1') {
    overlay.innerHTML = `<${heading}>${content.title}</${heading}><p>${content.text}</p>`;
    overlay.classList.add('visible');
}

// Function to hide the overlay
function hideOverlay() {
    overlay.classList.remove('visible');
}

// Generate Points for Convex Hull (Simplified Representation)
const points = [];
for (let i = 0; i < 30; i++) {
    points.push(
        new THREE.Vector3(
            Math.random() * 4 - 2, // x
            Math.random() * 4 - 2, // y
            Math.random() * 4 - 2  // z
        )
    );
}

// Create Convex Hull Geometry
const geometry = new ConvexGeometry(points);

// Define ShaderMaterial for Gradient Coloring
const gradientMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vPosition;
        void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vPosition;
        void main() {
            vec3 color = vec3(
                (vPosition.x + 2.0) / 4.0, // Map x to red
                (vPosition.y + 2.0) / 4.0, // Map y to green
                (vPosition.z + 2.0) / 4.0  // Map z to blue
            );
            gl_FragColor = vec4(color, 0.6); // Add transparency
        }
    `,
    transparent: true,
});

// Create the Amplituhedron Mesh
const amplituhedron = new THREE.Mesh(geometry, gradientMaterial);

// Add Edges (White Lines)
const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const edgesGeometry = new THREE.BufferGeometry();

// Extract positions from BufferGeometry and create edge vertices
const positionsArray = geometry.attributes.position.array;
const edgeVertices = [];

for (let i = 0; i < positionsArray.length; i += 9) {
    const v1 = new THREE.Vector3(
        positionsArray[i],
        positionsArray[i + 1],
        positionsArray[i + 2]
    );
    const v2 = new THREE.Vector3(
        positionsArray[i + 3],
        positionsArray[i + 4],
        positionsArray[i + 5]
    );
    const v3 = new THREE.Vector3(
        positionsArray[i + 6],
        positionsArray[i + 7],
        positionsArray[i + 8]
    );

    // Add edges for each triangle
    edgeVertices.push(v1, v2, v2, v3, v3, v1);
}

edgesGeometry.setFromPoints(edgeVertices);
const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

// Create a Group and Add All Objects
const amplituhedronGroup = new THREE.Group();
amplituhedronGroup.add(amplituhedron); // Add the main amplituhedron mesh
amplituhedronGroup.add(edges);          // Add the edges

// Initially scale down the group for reveal effect
amplituhedronGroup.scale.set(0, 0, 0);
scene.add(amplituhedronGroup);

// Orbit Controls for Interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// Responsive Design: Handle Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Storytelling Sequence using GSAP Timeline
const timeline = gsap.timeline({ defaults: { duration: 2 } });

// Step 1: Introduction
timeline.to({}, { duration: 0 }).call(() => {
    updateOverlay({
        title: 'The Complexity of Quantum Interactions',
        text: 'Calculating particle interactions in quantum physics is notoriously complex, involving intricate mathematical computations.'
    });
});

// Step 2: The Problem
timeline.to({}, { duration: 5 }).call(() => {
    updateOverlay({
        title: 'The Problem',
        text: 'Traditional methods require summing over countless possible interactions, making calculations cumbersome and inefficient.'
    });
});

// Step 3: Introduction to the Amplituhedron
timeline.to({}, { duration: 5 }).call(() => {
    updateOverlay({
        title: 'Introducing the Amplituhedron',
        text: 'A groundbreaking geometric concept that simplifies these calculations by redefining particle interactions through geometry.'
    });
});

// Step 4: Reveal the Amplituhedron
timeline.to({}, { duration: 1 }).call(() => {
    hideOverlay();
    // Animate the scaling up of the amplituhedron
    gsap.to(amplituhedronGroup.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        ease: 'elastic.out(1, 0.5)'
    });
    // Start rotating the group
    gsap.to(amplituhedronGroup.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: 'linear'
    });
});

// Step 5: Explanation After Reveal
timeline.to({}, { duration: 10 }).call(() => {
    updateOverlay({
        title: 'How It Solves the Problem',
        text: 'By representing interactions geometrically, the amplituhedron reduces the complexity, allowing for more efficient and elegant calculations.'
    });
});

// Step 6: Conclusion
timeline.to({}, { duration: 5 }).call(() => {
    updateOverlay({
        title: 'A New Era in Physics',
        text: 'The amplituhedron paves the way for deeper understanding and advancements in quantum physics and beyond.'
    });
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Initial Animation: Fade In Overlay
gsap.to({}, { duration: 1 }).call(() => {
    overlay.classList.add('visible');
});
