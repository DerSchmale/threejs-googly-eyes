import GooglyEyes from "GooglyEyes";
import {
    AmbientLight,
    Clock,
    CubeTextureLoader,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    NoToneMapping,
    PerspectiveCamera,
    Scene,
    SphereBufferGeometry,
    sRGBEncoding,
    WebGLRenderer
} from "three";
import {GLTFLoader} from "./vendor/GLTFLoader.js";

const canvas = document.getElementById("webglContainer");
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({antialias: true, canvas});
renderer.toneMapping = NoToneMapping;
renderer.outputEncoding = sRGBEncoding;
const clock = new Clock(false);

let model;
let eyes;
let oldX;


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new Scene();

window.addEventListener("resize", resize);

loadModel();

function loadModel()
{
    const loader = new GLTFLoader()
    loader.load("Suzanne.gltf", gltf => {
        initModel(gltf);
        loadSkybox();
    });
}

function initModel(gltf)
{
    camera.position.set(0, 0, 5);
    eyes = new GooglyEyes(0.25, 0.7);
    eyes.gravity = 0.5;
    model = gltf.scene;
    scene.add(model);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.x = 2.0;
    light.position.z = 2.0;
    light.position.y = 2.0;
    scene.add(light);

    const ambient = new AmbientLight(0xffffff, 0.1);
    scene.add(ambient);

    eyes.position.y = 0.25;
    eyes.position.z = 0.9;

    model.add(eyes);

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", () => oldX = undefined);
    canvas.addEventListener("touchmove", onTouchMove);
    canvas.addEventListener("touchend", () => oldX = undefined);

    clock.start();
    // init position
    resize();
}

// this is taken from the THREE LightProbe example
function loadSkybox()
{
    // envmap
    const genCubeUrls = function (prefix, postfix) {

        return [
            prefix + 'px' + postfix, prefix + 'nx' + postfix,
            prefix + 'py' + postfix, prefix + 'ny' + postfix,
            prefix + 'pz' + postfix, prefix + 'nz' + postfix
        ];

    };

    const urls = genCubeUrls('textures/cube/pisa/', '.png');

    new CubeTextureLoader().load(urls, function (cubeTexture) {

        cubeTexture.encoding = sRGBEncoding;

        scene.background = cubeTexture;

        const geometry = new SphereBufferGeometry(5, 64, 32);
        //const geometry = new THREE.TorusKnotGeometry( 4, 1.5, 256, 32, 2, 3 );

        const material = new MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0,
            envMap: cubeTexture,
            envMapIntensity: 1.0,
        });

        // mesh
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);

        scene.traverse(obj => {
            if (obj.isMesh) {
                obj.material.envMap = cubeTexture;
            }
        })

        render();

    });

}

function render()
{
    const dt = clock.getDelta();
    eyes.update(dt);
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}


function resize()
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function onMouseMove(event)
{
    if (event.buttons & 0x1)
        rotate(event.clientX);

    move(event.clientX, event.clientY);
}

function onTouchMove(event)
{
    if (event.touches.length > 1)
        rotate(event.touches[0].clientX);

    move(event.touches[0].clientX, event.touches[0].clientY);
}

function rotate(x)
{
    if (oldX !== undefined) {
        const dx = oldX - x;
        model.rotation.y -= dx / window.innerWidth * 10.0;
    }

    oldX = x;
}

function move(x, y)
{
    x = x / window.innerWidth * 2.0 - 1.0;
    y = -(y / window.innerHeight * 2.0 - 1.0);
    model.position.set(x, y, 0.96).unproject(camera);
}
