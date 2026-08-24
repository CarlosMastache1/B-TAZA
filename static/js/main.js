// ==========================================
// 1. CONFIGURACIÓN DE LENIS (SCROLL SUAVE)
// ==========================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);


// ==========================================
// 2. CONFIGURACIÓN BASE DE THREE.JS
// ==========================================
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10); 

const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true, 
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// ==========================================
// 3. ILUMINACIÓN (ESTILO "PREMIUM")
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 2);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);


// ==========================================
// 4. EL MODELO (PRUEBA DEL CUBO VERDE)
// ==========================================
let coffeeBean; // Mantenemos el nombre de la variable para no romper el GSAP



const loader = new THREE.GLTFLoader();
loader.load(
    '/static/models/grano.glb', 
    function (gltf) {
        coffeeBean = gltf.scene;

        const box = new THREE.Box3().setFromObject(coffeeBean);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        coffeeBean.position.x += (coffeeBean.position.x - center.x);
        coffeeBean.position.y += (coffeeBean.position.y - center.y);
        coffeeBean.position.z += (coffeeBean.position.z - center.z);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        coffeeBean.scale.set(scale, scale, scale);

        coffeeBean.position.set(0, 0, 0);
        
        scene.add(coffeeBean);
        initScrollAnimations();
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% cargado');
    },
    function (error) {
        console.error('Error al cargar el modelo 3D:', error);
    }
);



// ==========================================
// 5. ANIMACIONES CON GSAP (SCROLLYTELLING)
// ==========================================
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Rotación constante
    gsap.to(coffeeBean.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none"
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1 
        }
    });

    // Movimiento en el primer scroll
    tl.to(coffeeBean.position, {
        x: -3, 
        y: 0,
        z: 4, 
        ease: "power1.inOut"
    }, 0.1);

    // Movimiento en el segundo scroll
    tl.to(coffeeBean.position, {
        x: 3,
        y: -1,
        z: 2,
        ease: "power1.inOut"
    }, 0.5); 
    
    tl.to(coffeeBean.rotation, {
        x: Math.PI / 2, 
        z: Math.PI / 4,
        ease: "power1.inOut"
    }, 0.5);
}


// ==========================================
// 6. LOOP DE RENDERIZADO Y RESPONSIVE
// ==========================================
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});