//

const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / innerHeight, 1, 100);
let renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// let controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.update();
let directionalLight;
let charaMesh;
let coronaMesh;
var clock = new THREE.Clock();

// CANNON World
let worldCANNON = new CANNON.World();
worldCANNON.gravity.set(0, -10, 0);
worldCANNON.broadphase = new CANNON.NaiveBroadphase();

// CANNON Chara

let charaCANNON = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
let charaBody = new CANNON.Body({
    shape: charaCANNON,
    mass: 0
});
charaBody.position.y += 1;
worldCANNON.add(charaBody);

// CANNON Corona

let coronaCANNON = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
let coronaBody = new CANNON.Body({
    shape: coronaCANNON,
    mass: 0
});
worldCANNON.add(coronaBody);


let debugRenderer = new THREE.CannonDebugRenderer(scene, worldCANNON);


function init() {
    scene.background = new THREE.Color('#c9e9f6');
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(0, 8, 10);
    camera.lookAt(0, 0, 0);
    document.body.appendChild(renderer.domElement);
    scene.add(camera);
}


// Light
function setLight() {
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    camera.add(directionalLight);
}

// Load Character

// let raycaster = new THREE.Raycaster();

function loadChara() {
    const loader = new THREE.GLTFLoader();
    loader.load('./resource/model/chara.gltf', (gltf) => {
        charaMesh = gltf.scene;
        charaMesh.castShadow = true;

        // Animations
        mixerChara = new THREE.AnimationMixer(charaMesh);

        let actionAttack = mixerChara.clipAction(gltf.animations[0]);

        let actionIdle = mixerChara.clipAction(gltf.animations[1]);

        let actionWalk = mixerChara.clipAction(gltf.animations[2]);

        // Document KeyDown
        document.addEventListener("keydown", onDocumentKeyDown, false);
        // Document KeyUp
        document.addEventListener("keyup", onDocumentKeyUp, false);


        // Idle (nothing)
        actionIdle.play();


        // KeyCode on Pressed
        let keyForward = false;
        let keyBackward = false;
        let keyLeft = false;
        let keyRight = false;
        let keyAttack = false;


        let movement = new THREE.Vector3(0, 0, 0);
        const directionLeft = new THREE.Vector3(-0.1, 0, 0);
        const directionRight = new THREE.Vector3(0.1, 0, 0);
        const directionForward = new THREE.Vector3(0, 0, -0.1);
        const directionBackward = new THREE.Vector3(0, 0, 0.1);
        const directionLeftCombine = new THREE.Vector3(-0.05, 0, 0);
        const directionRightCombine = new THREE.Vector3(0.05, 0, 0);
        const directionForwardCombine = new THREE.Vector3(0, 0, -0.05);
        const directionBackwardCombine = new THREE.Vector3(0, 0, 0.05);





        function onDocumentKeyDown(event) {
            let keyCode = event.which;

            console.log(charaMesh.position);
            console.log(coronaMesh.position);

            // Move Left (left arrow)
            if (keyCode == 37) {
                keyLeft = true;
                if (keyLeft == true) {
                    actionIdle.stop();
                    charaMesh.rotation.y = -Math.PI / 2;
                    if (Math.trunc(coronaMesh.position.x) + 2 != Math.trunc(charaMesh.position.x) ||
                        Math.trunc(coronaMesh.position.z) - 2 >= Math.trunc(charaMesh.position.z) ||
                        Math.trunc(coronaMesh.position.z) + 2 <= Math.trunc(charaMesh.position.z)
                    ) {
                        movement.add(directionLeft);
                    }
                    actionWalk.play();
                }
                if (keyLeft == true && keyForward == true) {
                    charaMesh.rotation.y = -Math.PI / 1.5;
                    movement.add(directionForwardCombine);
                }
                if (keyLeft == true && keyBackward == true) {
                    charaMesh.rotation.y = -Math.PI / 3;
                    movement.add(directionBackwardCombine);
                }
            }
            // Move Right (right arrow)
            else if (keyCode == 39) {
                keyRight = true;
                if (keyRight == true) {
                    actionIdle.stop();
                    charaMesh.rotation.y = Math.PI / 2;
                    if (Math.trunc(coronaMesh.position.x) - 1 != Math.trunc(charaMesh.position.x) ||
                        Math.trunc(coronaMesh.position.z) - 1 > Math.trunc(charaMesh.position.z) ||
                        Math.trunc(coronaMesh.position.z) + 1 < Math.trunc(charaMesh.position.z)
                    ) {
                        movement.add(directionRight);
                    }
                    actionWalk.play();
                }
                if (keyRight == true && keyForward == true) {
                    charaMesh.rotation.y = Math.PI / 1.5;
                    movement.add(directionForwardCombine);
                }
                if (keyRight == true && keyBackward == true) {
                    charaMesh.rotation.y = Math.PI / 3;
                    movement.add(directionBackwardCombine);
                }
            }
            // Move Forward (up arrow)
            else if (keyCode == 38) {
                keyForward = true;
                if (keyForward == true) {
                    actionIdle.stop();
                    charaMesh.rotation.y = Math.PI / 1;
                    if (Math.trunc(coronaMesh.position.z) + 1 != Math.trunc(charaMesh.position.z) ||
                        Math.trunc(coronaMesh.position.x) + 2 < Math.trunc(charaMesh.position.x) ||
                        Math.trunc(coronaMesh.position.x) - 2 >= Math.trunc(charaMesh.position.x)
                    ) {
                        movement.add(directionForward);
                    }
                    actionWalk.play();
                }
                if (keyLeft == true && keyForward == true) {
                    charaMesh.rotation.y = -Math.PI / 1.5;
                    movement.add(directionLeftCombine);
                }
                if (keyRight == true && keyForward == true) {
                    charaMesh.rotation.y = Math.PI / 1.5;
                    movement.add(directionRightCombine);
                }
            }
            // Move Backward (down arrow)
            else if (keyCode == 40) {
                keyBackward = true;
                if (keyBackward == true) {
                    actionIdle.stop();
                    charaMesh.rotation.set(0, 0, 0);
                    if (Math.trunc(coronaMesh.position.z) - 1 != Math.trunc(charaMesh.position.z) ||
                        Math.trunc(coronaMesh.position.x) + 2 < Math.trunc(charaMesh.position.x) ||
                        Math.trunc(coronaMesh.position.x) - 2 >= Math.trunc(charaMesh.position.x)
                    ) {
                        movement.add(directionBackward);
                    }
                    actionWalk.play();
                }
                if (keyLeft == true && keyBackward == true) {
                    charaMesh.rotation.y = -Math.PI / 3;
                    movement.add(directionLeftCombine);
                }
                if (keyRight == true && keyBackward == true) {
                    charaMesh.rotation.y = Math.PI / 3;
                    movement.add(directionRightCombine);
                }
            }
            // Attack (z)
            else if (keyCode == 90) {
                keyAttack = true;
                if (keyAttack == true) {
                    actionIdle.stop();
                    actionAttack.setLoop(THREE.LoopOnce);
                    actionAttack.play().reset();

                    let pendengar = new THREE.AudioListener();
                    camera.add(pendengar);

                    let sound = new THREE.Audio(pendengar);
                    let louder = new THREE.AudioLoader().load('./resource/audio/effect/attack.wav',
                        (hasil) => {
                            sound.setBuffer(hasil);
                            sound.play();
                        }
                    );
                }
            }


            let cameraMovement = new THREE.Vector3(0, 8, 10);
            cameraMovement.add(movement);

            camera.position.copy(cameraMovement);
            // directionalLight.position.copy(cameraMovement);

            charaBody.position.copy(movement).y += 1;


            charaMesh.position.copy(movement);



        };


        function onDocumentKeyUp(event) {
            let keyCode = event.which;

            // Idle State

            // Move Left (left arrow)
            if (keyCode == 37) {
                keyLeft = false;
                if (keyLeft == false) {
                    actionWalk.stop();
                    actionIdle.play();
                }
            }
            // Move Right (right arrow)
            if (keyCode == 39) {
                keyRight = false;
                if (keyRight == false) {
                    actionWalk.stop();
                    actionIdle.play();
                }
            }
            // Move Forward (up arrow)
            if (keyCode == 38) {
                keyForward = false;
                if (keyForward == false) {
                    actionWalk.stop();
                    actionIdle.play();
                }
            }
            // Move Backward (down arrow)
            if (keyCode == 40) {
                keyBackward = false;
                if (keyBackward == false) {
                    actionWalk.stop();
                    actionIdle.play();
                }
            }

        };

        scene.add(charaMesh);

    })



};
// Coba Text
let selectedFont;
let tulisan="Jangan Lupa Pakai Masker!";
let loader1= new THREE.FontLoader().load('fonts/optimer_bold.typeface.json',(e)=>{
    selectedFont=e;
    let tgeo= new THREE.TextGeometry(tulisan,{
        size:5,
        height:1,
        font:selectedFont,
    });
    let tmat=new THREE.MeshPhongMaterial({
        color:0xff0000,
    })
    let tmesh= new THREE.Mesh(tgeo,tmat);
    tmesh.position.set(-40,1,-30);
    scene.add(tmesh);
});

function loadCorona() {
    const loader = new THREE.GLTFLoader();
    loader.load('./resource/model/corona.gltf', (gltf) => {
        coronaMesh = gltf.scene;
        coronaMesh.castShadow = true;
        coronaMesh.position.set(-5, 1, 0);

        // Animations
        mixerCorona = new THREE.AnimationMixer(coronaMesh);

        let actionAttacked = mixerCorona.clipAction(gltf.animations[0]);

        let actionIdle = mixerCorona.clipAction(gltf.animations[1]);


        // Idle (nothing)
        actionIdle.play();

        // KeyCode on Pressed
        let keyAttacked = false;

        // Document KeyDown
        document.addEventListener("keydown", onDocumentKeyDown, false);
        // Document KeyUp
        document.addEventListener("keyup", onDocumentKeyUp, false);
        let tambahscore = 0;

        function onDocumentKeyDown(event) {
            let keyCode = event.which;

            // Attacked
            if (keyCode == 90) {
                keyAttacked = true;
                if (keyAttacked == true) {
                    // From Right

                    if (Math.trunc(coronaMesh.position.x) + 2 == Math.trunc(charaMesh.position.x) &&
                        Math.trunc(coronaMesh.position.z) == Math.trunc(charaMesh.position.z)) {
                        coronaMesh.rotation.y = Math.PI / 2;
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        actionIdle.stop();
                    }
                    if (Math.trunc(coronaMesh.position.x) + 2 == Math.trunc(charaMesh.position.x) &&
                        Math.trunc(coronaMesh.position.z) + 1 == Math.trunc(charaMesh.position.z)) {
                        coronaMesh.rotation.y = Math.PI / 2;
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        actionIdle.stop();
                    }
                    if (Math.trunc(coronaMesh.position.x) + 2 == Math.trunc(charaMesh.position.x) &&
                        Math.trunc(coronaMesh.position.z) - 1 == Math.trunc(charaMesh.position.z)) {
                        coronaMesh.rotation.y = Math.PI / 2;
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        actionIdle.stop();
                    }
                    // From Left
                    if (Math.trunc(coronaMesh.position.x) - 1 == Math.trunc(charaMesh.position.x) &&
                        Math.trunc(coronaMesh.position.z) == Math.trunc(charaMesh.position.z)) {
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        coronaMesh.rotation.y = -Math.PI / 2;
                        actionIdle.stop();
                    }
                    if (Math.trunc(coronaMesh.position.x) - 1 == Math.trunc(charaMesh.position.x) &&
                        Math.trunc(coronaMesh.position.z) + 1 == Math.trunc(charaMesh.position.z)) {
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        coronaMesh.rotation.y = -Math.PI / 2;
                        actionIdle.stop();
                    }
                    if (Math.trunc(coronaMesh.position.x) - 1 == Math.trunc(charaMesh.position.x) &&
                        Math.trunc(coronaMesh.position.z) - 1 == Math.trunc(charaMesh.position.z)) {
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        coronaMesh.rotation.y = -Math.PI / 2;
                        actionIdle.stop();
                    }
                    // From Bottom
                    if (Math.trunc(coronaMesh.position.z) + 1 == Math.trunc(charaMesh.position.z) &&
                        Math.trunc(coronaMesh.position.x) == Math.trunc(charaMesh.position.x)
                    ) {
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        coronaMesh.rotation.set(0, 0, 0);
                        actionIdle.stop();
                    }
                    if (Math.trunc(coronaMesh.position.z) + 1 == Math.trunc(charaMesh.position.z) &&
                        Math.trunc(coronaMesh.position.x) + 1 == Math.trunc(charaMesh.position.x)
                    ) {
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        coronaMesh.rotation.set(0, 0, 0);
                        actionIdle.stop();
                    }
                    if (Math.trunc(coronaMesh.position.z) + 1 == Math.trunc(charaMesh.position.z) &&
                        Math.trunc(coronaMesh.position.x) + 2 == Math.trunc(charaMesh.position.x)
                    ) {
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        coronaMesh.rotation.set(0, 0, 0);
                        actionIdle.stop();
                    }
                    if (Math.trunc(coronaMesh.position.z) + 1 == Math.trunc(charaMesh.position.z) &&
                        Math.trunc(coronaMesh.position.x) - 1 == Math.trunc(charaMesh.position.x)
                    ) {
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        coronaMesh.rotation.set(0, 0, 0);
                        actionIdle.stop();
                    }
                    // From Top
                    if (Math.trunc(coronaMesh.position.z) - 1 == Math.trunc(charaMesh.position.z) &&
                        Math.trunc(coronaMesh.position.x) == Math.trunc(charaMesh.position.x)
                    ) {
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        coronaMesh.rotation.y = -Math.PI / 1;
                        actionIdle.stop();
                    }
                    if (Math.trunc(coronaMesh.position.z) - 1 == Math.trunc(charaMesh.position.z) &&
                        Math.trunc(coronaMesh.position.x) + 1 == Math.trunc(charaMesh.position.x)
                    ) {
                        tambahscore = tambahscore + 1;
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        coronaMesh.rotation.y = -Math.PI / 1;
                        actionIdle.stop();
                    }
                    if (Math.trunc(coronaMesh.position.z) - 1 == Math.trunc(charaMesh.position.z) &&
                        Math.trunc(coronaMesh.position.x) + 2 == Math.trunc(charaMesh.position.x)
                    ) {
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        tambahscore = tambahscore + 1;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        coronaMesh.rotation.y = -Math.PI / 1;
                        actionIdle.stop();
                    }
                    if (Math.trunc(coronaMesh.position.z) - 1 == Math.trunc(charaMesh.position.z) &&
                        Math.trunc(coronaMesh.position.x) - 1 == Math.trunc(charaMesh.position.x)
                    ) {
                        coronaMesh.position.z = Math.random() * 10;
                        coronaMesh.position.x = Math.random() * 5;
                        tambahscore = tambahscore + 1;
                        actionAttacked.setLoop(THREE.LoopOnce);
                        actionAttacked.play().reset();
                        coronaMesh.rotation.y = -Math.PI / 1;
                        actionIdle.stop();
                    }
                }
            }

            coronaBody.position.copy(coronaMesh.position);
            console.log("tambah score:", tambahscore);

        };


        function onDocumentKeyUp(event) {
            let keyCode = event.which;

            // Attacked
            if (keyCode == 90) {
                keyAttacked = false;
                if (keyAttacked == false) {
                    if (coronaMesh.position.x + 2 == Math.trunc(charaMesh.position.x)) {
                        actionIdle.play();
                    }
                    if (coronaMesh.position.x - 1 == Math.trunc(charaMesh.position.x)) {
                        actionIdle.play();
                    }
                    if (coronaMesh.position.z + 1 == Math.trunc(charaMesh.position.z)) {
                        actionIdle.play();
                    }
                    if (coronaMesh.position.z - 1 == Math.trunc(charaMesh.position.z)) {
                        actionIdle.play();
                    }
                }
            }

        };


        scene.add(coronaMesh);
    })


};


// Load Ground

function loadGround() {
    const loader = new THREE.TextureLoader();
    const groundTexture = loader.load('./resource/texture/grass.png');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    // groundTexture.wrapS = groundTexture.wrapT = THREE.MirroredRepeatWrapping;
    groundTexture.repeat.set(150, 100);
    // groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    const groundMaterial = new THREE.MeshLambertMaterial({
        map: groundTexture
    });

    let meshGround = new THREE.Mesh(new THREE.PlaneGeometry(150, 50), groundMaterial);
    meshGround.rotation.x = -Math.PI / 2;
    meshGround.receiveShadow = true;
    scene.add(meshGround);

    let groundCANNON = new CANNON.Plane();
    let planeBodyCANNON = new CANNON.Body({
        shape: groundCANNON,
        mass: 0
    });
    planeBodyCANNON.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    worldCANNON.addBody(planeBodyCANNON);
}


function loadBGM() {
    // sound

    let pendengar = new THREE.AudioListener();
    camera.add(pendengar);

    let sound = new THREE.Audio(pendengar);
    let louder = new THREE.AudioLoader().load('./resource/audio/bgm/seal-online.3gp',
        (hasil) => {
            sound.setBuffer(hasil);
            sound.play();
            sound.setVolume(0.02);
            sound.setLoop(true);
        }
    );
}

window.addEventListener('resize', function () {
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
});

function animate() {
    requestAnimationFrame(animate);

    // debugRenderer.update();

    var delta = clock.getDelta();

    mixerChara.update(delta);
    mixerCorona.update(delta);

    renderer.render(scene, camera);
}

init();
setLight();
loadChara();
loadCorona();
loadGround();
// loadBGM();
animate();