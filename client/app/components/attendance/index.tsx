import * as React from 'react';
import { Component } from 'react';
import { Toast } from "antd-mobile";
import * as THREE from 'three';
import { Quaternion, Vector3 } from 'three'
import * as TrackballControls from 'three-trackballcontrols';
import { AttendanceStyled } from "./styled";
import { MyIcons } from "../styled";
import { login, signIn } from "./interface";
import { any } from 'prop-types';
export interface AttendanceProps {
    
}

const initialState = {
    controlObj: {
        addCube: () => {}
    }
}
type State = Readonly<typeof initialState>;
function contextmenu(event) {
	event.preventDefault();
}
class FlyControls {
    object = null
    domElement = null
    movementSpeed = null
    rollSpeed = null
    dragToLook = null
    autoForward = null
    tmpQuaternion = null
    mouseStatus = null
    moveState = null
    moveVector = null
    rotationVector = null
    onMouseMove = null
    onMouseDown = null
    onMouseUp = null
    onKeyDown = null
    onKeyUp = null
    movementSpeedMultiplier = null
	constructor(object, domElement = document) {

		this.object = object;
		this.domElement = domElement;
		if (this.domElement !== document) {
			this.domElement.setAttribute('tabindex', -1);
		}

		// API
		this.movementSpeed = 1.0;
		this.rollSpeed = 0.005;
		this.dragToLook = false;
		this.autoForward = false;// internals

		// internals
		this.tmpQuaternion = new Quaternion();
		this.mouseStatus = 0;
		this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
		this.moveVector = new Vector3(0, 0, 0);
		this.rotationVector = new Vector3(0, 0, 0);

		// binding
		this.onMouseMove = this.handleMouseMove.bind(this)
		this.onMouseDown = this.handleMouseDown.bind(this)
		this.onMouseUp = this.handleMouseUp.bind(this)
		this.onKeyDown = this.handleKeyDown.bind(this)
		this.onKeyUp = this.handleKeyUp.bind(this)

		// event listeners
		this.domElement.addEventListener('contextmenu', contextmenu, false);
		this.domElement.addEventListener('mousemove', this.onMouseMove, false);
		this.domElement.addEventListener('mousedown', this.onMouseDown, false);
		this.domElement.addEventListener('mouseup', this.onMouseUp, false);
		window.addEventListener('keydown', this.onKeyDown, false);
		window.addEventListener('keyup', this.onKeyUp, false );

		// first update
		this.updateMovementVector();
		this.updateRotationVector();
	}

	dispose() {
		this.domElement.removeEventListener('contextmenu', contextmenu, false);
		this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
		this.domElement.removeEventListener('mousemove', this.onMouseMove, false);
		this.domElement.removeEventListener('mouseup', this.onMouseUp, false);

		window.removeEventListener('keydown', this.onKeyDown, false);
		window.removeEventListener('keyup', this.onKeyUp, false);
	}

	keyHandler(code, amount, movementSpeedMultiplier) {
		switch (code) {
			case 16: /* shift */ this.movementSpeedMultiplier = movementSpeedMultiplier; break;

			case 87: /*W*/ this.moveState.forward = amount; break;
			case 83: /*S*/ this.moveState.back = amount; break;

			case 65: /*A*/ this.moveState.left = amount; break;
			case 68: /*D*/ this.moveState.right = amount; break;

			case 82: /*R*/ this.moveState.up = amount; break;
			case 70: /*F*/ this.moveState.down = amount; break;

			case 38: /*up*/ this.moveState.pitchUp = amount; break;
			case 40: /*down*/ this.moveState.pitchDown = amount; break;

			case 37: /*left*/ this.moveState.yawLeft = amount; break;
			case 39: /*right*/ this.moveState.yawRight = amount; break;

			case 81: /*Q*/ this.moveState.rollLeft = amount; break;
			case 69: /*E*/ this.moveState.rollRight = amount; break;
		}
		this.updateMovementVector();
		this.updateRotationVector();
	}

	handleKeyDown(event) {
		if (event.altKey) {
			return
		}
		this.keyHandler(event.keyCode, 1, .1)
	}

	handleKeyUp(event) {
		this.keyHandler(event.keyCode, 0, 1)
	}

	handleMouseDown(event) {
		if (this.domElement !== document) {
			this.domElement.focus();
		}

		event.preventDefault();
		event.stopPropagation();

		if (this.dragToLook) {
			this.mouseStatus++;
		} else {
			switch (event.button ) {
				case 0: this.moveState.forward = 1; break;
				case 2: this.moveState.back = 1; break;
			}
			this.updateMovementVector();
		}
	}

	handleMouseMove(event) {
		if (!this.dragToLook || this.mouseStatus > 0) {
			var container = this.getContainerDimensions();
			var halfWidth  = container.size[ 0 ] / 2;
			var halfHeight = container.size[ 1 ] / 2;

			this.moveState.yawLeft   = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
			this.moveState.pitchDown =   ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

			this.updateRotationVector();
		}
	}

	handleMouseUp(event) {
		event.preventDefault();
		event.stopPropagation();

		if (this.dragToLook) {
			this.mouseStatus--;
			this.moveState.yawLeft = this.moveState.pitchDown = 0;
		} else {
			switch (event.button) {
				case 0: this.moveState.forward = 0; break;
				case 2: this.moveState.back = 0; break;
			}
			this.updateMovementVector();
		}

		this.updateRotationVector();
	}

	update(delta) {
		var moveMult = delta * this.movementSpeed;
		var rotMult = delta * this.rollSpeed;

		this.object.translateX(this.moveVector.x * moveMult);
		this.object.translateY(this.moveVector.y * moveMult);
		this.object.translateZ(this.moveVector.z * moveMult);

		this.tmpQuaternion.set(this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1).normalize();
		this.object.quaternion.multiply(this.tmpQuaternion);

		// expose the rotation vector for convenience
		this.object.rotation.setFromQuaternion(this.object.quaternion, this.object.rotation.order);
	}

	updateMovementVector() {
		var forward = ( this.moveState.forward || (this.autoForward && ! this.moveState.back) ) ? 1 : 0;

		this.moveVector.x = -this.moveState.left + this.moveState.right;
		this.moveVector.y = -this.moveState.down + this.moveState.up;
		this.moveVector.z = -forward + this.moveState.back;
	}

	updateRotationVector() {
		this.rotationVector.x = (-this.moveState.pitchDown + this.moveState.pitchUp);
		this.rotationVector.y = (-this.moveState.yawRight  + this.moveState.yawLeft);
		this.rotationVector.z = (-this.moveState.rollRight + this.moveState.rollLeft);
	}

	getContainerDimensions() {
		if (this.domElement !== document) {
			return {
				size : [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset : [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
			}
		} else {
			return {
				size : [ window.innerWidth, window.innerHeight ],
				offset : [ 0, 0 ]
			}
		}
	}
}

function addHouseAndTree(scene) {

    createBoundingWall(scene);
    createGroundPlane(scene);
    createHouse(scene);
    createTree(scene);

    function createBoundingWall(scene) {
        var wallLeft = new THREE.CubeGeometry(100, 2, 2);
        var wallRight = new THREE.CubeGeometry(100, 2, 2);
        var wallTop = new THREE.CubeGeometry(2, 2, 100);
        var wallBottom = new THREE.CubeGeometry(2, 2, 100);

        var wallMaterial = new THREE.MeshPhongMaterial({
            color: 0xa0522d
        });

        var wallLeftMesh = new THREE.Mesh(wallLeft, wallMaterial);
        var wallRightMesh = new THREE.Mesh(wallRight, wallMaterial);
        var wallTopMesh = new THREE.Mesh(wallTop, wallMaterial);
        var wallBottomMesh = new THREE.Mesh(wallBottom, wallMaterial);

        wallLeftMesh.position.set(15, 1, -25);
        wallRightMesh.position.set(15, 1, 25);
        wallTopMesh.position.set(-19, 1, 0);
        wallBottomMesh.position.set(49, 1, 0);

        scene.add(wallLeftMesh);
        scene.add(wallRightMesh);
        scene.add(wallBottomMesh);
        scene.add(wallTopMesh);

    }
    function createGroundPlane(scene) {
        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(100, 100);
        var planeMaterial = new THREE.MeshPhongMaterial({
            color: 0x9acd32
        });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        // plane.rotation.x = 0;
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        scene.add(plane)
    }

    function createHouse(scene) {
        var roof = new THREE.ConeGeometry(5, 4);
        var base = new THREE.CylinderGeometry(5, 5, 6);

        // create the mesh
        var roofMesh = new THREE.Mesh(roof, new THREE.MeshPhongMaterial({
            color: 0x8b7213
        }));
        var baseMesh = new THREE.Mesh(base, new THREE.MeshPhongMaterial({
            color: 0xffe4c4
        }));

        roofMesh.position.set(25, 8, 0);
        baseMesh.position.set(25, 3, 0);

        roofMesh.receiveShadow = true;
        baseMesh.receiveShadow = true;
        roofMesh.castShadow = true;
        baseMesh.castShadow = true;

        scene.add(roofMesh);
        scene.add(baseMesh);
    }

    /**
     * Add the tree to the scene
     * @param scene The scene to add the tree to
     */
    function createTree(scene) {
        var trunk = new THREE.CubeGeometry(1, 8, 1);
        var leaves = new THREE.SphereGeometry(4);

        // create the mesh
        var trunkMesh = new THREE.Mesh(trunk, new THREE.MeshPhongMaterial({
            color: 0x8b4513
        }));
        var leavesMesh = new THREE.Mesh(leaves, new THREE.MeshPhongMaterial({
            color: 0x00ff00
        }));

        // position the trunk. Set y to half of height of trunk
        trunkMesh.position.set(-10, 4, 0);
        leavesMesh.position.set(-10, 12, 0);

        trunkMesh.castShadow = true;
        trunkMesh.receiveShadow = true;
        leavesMesh.castShadow = true;
        leavesMesh.receiveShadow = true;

        scene.add(trunkMesh);
        scene.add(leavesMesh);
    }
}
function initRenderer(additionalProperties:any=undefined) {

    var props = (typeof additionalProperties !== 'undefined' && additionalProperties) ? additionalProperties : {};
    var renderer = new THREE.WebGLRenderer(props);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, document.getElementById("box").clientHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById("box").appendChild(renderer.domElement);

    return renderer;
}
function initCamera(initialPosition:any=undefined) {
    var position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(-30, 40, 30);

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.copy(position);
    camera.lookAt(new THREE.Vector3(4, 0, 4));

    return camera;
}

class Attendance extends React.Component<AttendanceProps> {
    readonly state: State = {
        controlObj: {
            addCube: () => {}
        }
    }
    signInFunc = async (params) => {
        const _res = await signIn(params);
        Toast.info(_res.desc);
    }
    loginFunc = async (loginParams, signParams) => {
        const _res = await login(loginParams);
        if ( _res.status ) {
            console.log("asfasgadgadg")
            Toast.info('登陆成功');
            const {
                access_token,
                hrm_uuid,
            } = _res.res;
            const {
                company_id,
                uuid
            } = hrm_uuid;
            const sign_time = '2018-11-23 08:58:58';
            this.signInFunc({
                access_token,
                company_id,
                uuid,
                sign_time,
                ...signParams
            })
        } else {
            Toast.info(_res.desc);
        }
    }
    /**
 * Initialize trackball controls to control the scene
 * 
 * @param {THREE.Camera} camera 
 * @param {THREE.Renderer} renderer 
 */
    initTrackballControls(camera, renderer) {
        var trackballControls = new TrackballControls(camera, renderer.domElement);
        trackballControls.rotateSpeed = 1.0;
        trackballControls.zoomSpeed = 1.2;
        trackballControls.panSpeed = 0.8;
        trackballControls.noZoom = false;
        trackballControls.noPan = false;
        trackballControls.staticMoving = true;
        trackballControls.dynamicDampingFactor = 0.3;
        trackballControls.keys = [65, 83, 68];

        return trackballControls;
    }
    renderer = null
    camera = null
    scene = null
    init=() => {
        const _this = this;
        this.renderer = initRenderer();
        this.camera = initCamera();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        this.scene = new THREE.Scene();
        var clock = new THREE.Clock();
        // add ambient lighting
        var ambientLight = new THREE.AmbientLight("#606008", 1);
        this.scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
        spotLight.shadow.mapSize.set(2048, 2048);
        spotLight.position.set(-30, 40, -10);
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        // add a simple scene
        addHouseAndTree(this.scene)
        /* var flyControls = new FlyControls(this.camera);
        flyControls.movementSpeed = 25;
        flyControls.domElement = document.querySelector("#box");
        flyControls.rollSpeed = Math.PI / 24;
        flyControls.autoForward = false;
        flyControls.dragToLook = false; */
        // var trackballControls = this.initTrackballControls(this.camera, this.renderer);
        // call the render function
        render();

        function render() {
            // flyControls.update(clock.getDelta());
            // trackballControls.update(clock.getDelta());
            requestAnimationFrame(render);
            _this.renderer.render(_this.scene, _this.camera);
        }
    }
    componentDidMount() {
        this.init();
    }
    render() {
        let startX, startY, moveEndX, moveEndY, X, Y, direction_z = 30, direction_x = -30, direction_y = 40;

        return (  
            <AttendanceStyled>
                <div id="box" className="box"/*  onTouchStart={(e) => {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                }}
                onTouchMove={(e) => {
                    moveEndX = e.changedTouches[0].pageX;
                    moveEndY = e.changedTouches[0].pageY;
                }} 
                onTouchEnd={(e) => {
                    X = moveEndX - startX;
                    Y = moveEndY - startY;
                   
                    if ( Math.abs(X) > Math.abs(Y) && X > 0 && Y > 0) {
                        direction_x -= 1;
                        direction_z -= 1;
                        this.camera.position.x = direction_x;
                        this.camera.position.z = direction_z;
                        this.renderer.render(this.scene, this.camera);
                        console.log("右");
                        
                    }
                    else if ( Math.abs(X) > Math.abs(Y) && X > 0 && Y < 0) {
                        direction_x -= 1;
                        direction_z -= 0.5;
                        this.camera.position.x = direction_x;
                        this.camera.position.z = direction_z;
                        this.renderer.render(this.scene, this.camera);
                        console.log("右上");
                        
                    }
                    else if ( Math.abs(X) > Math.abs(Y) && X < 0 && Y < 0) {
                        /* direction_x += 1;
                        direction_z += 1;
                        this.camera.position.x = direction_x;
                        this.camera.position.z = direction_z;
                        this.renderer.render(this.scene, this.camera); 
                        console.log("3");
                    }
                    else if ( Math.abs(X) > Math.abs(Y) && X < 0 && Y > 0) {
                        /* direction_x += 1;
                        direction_z += 1;
                        this.camera.position.x = direction_x;
                        this.camera.position.z = direction_z;
                        this.renderer.render(this.scene, this.camera);
                        console.log("4");
                    }
                    else if ( Math.abs(X) < Math.abs(Y) && X> 0 && Y > 0) {
                        /* direction_x -= 1;
                        direction_z += 1;
                        this.camera.position.x = direction_x;
                        this.camera.position.z = direction_z;
                        this.renderer.render(this.scene, this.camera); 
                        console.log("5");
                    }
                    else if ( Math.abs(X) < Math.abs(Y) && X < 0 && Y > 0 ) {
                        /* direction_x += 1;
                        direction_z -= 1;
                        this.camera.position.x = direction_x;
                        this.camera.position.z = direction_z;
                        this.renderer.render(this.scene, this.camera); 
                        console.log("6");
                    }
                    else if ( Math.abs(X) < Math.abs(Y) && X < 0 && Y < 0 ) {
                        /* direction_x += 1;
                        direction_z -= 1;
                        this.camera.position.x = direction_x;
                        this.camera.position.z = direction_z;
                        this.renderer.render(this.scene, this.camera); 
                        console.log("7");
                    }
                    else if ( Math.abs(X) < Math.abs(Y) && X > 0 && Y < 0 ) {
                        /* direction_x += 1;
                        direction_z -= 1;
                        this.camera.position.x = direction_x;
                        this.camera.position.z = direction_z;
                        this.renderer.render(this.scene, this.camera);
                        console.log("8");
                    }
                    else{
                        console.log("没滑动");
                    }
                }} */>
                    <MyIcons className="icon" onClick={() => {
                        this.loginFunc({
                            username: '13570264649',
                            password: 'yehuiyu152+'
                        }, {
                            equipment: 'OPPO R9s-6.0.1(3bd3a8dd)',
                            equipment_number: '3bd3a8dd',
                            phone_model: 'OPPO R9s',
                            operating_system: 'Android Linux6.0.1'
                        });
                    }} width="1.92" url={require('../../images/baseline_fingerprint_white_48.png')}/>
                    <MyIcons className="icon2" onClick={() => {
                        this.loginFunc({
                            username: '18948319410',
                            password: 'w123456'
                        }, {
                            equipment: 'SM-G9009W-5.0(1e2699b9)',
                            equipment_number: '1e2699b9',
                            phone_model: 'SM-G9009W',
                            operating_system: 'Android Linux5.0'
                        });
                    }} width="1.92" url={require('../../images/baseline_fingerprint_white_48.png')}/>
                </div>
            </AttendanceStyled>
        );
    }
}
 
export default Attendance;