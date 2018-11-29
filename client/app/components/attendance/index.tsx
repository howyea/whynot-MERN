import * as React from 'react';
import { Component } from 'react';
import { Toast } from "antd-mobile";
import * as THREE from 'three';
import { AttendanceStyled } from "./styled";
import { MyIcons } from "../styled";
import { login, signIn } from "./interface";
export interface AttendanceProps {
    
}

const initialState = {
}
type State = Readonly<typeof initialState>;
class Attendance extends React.Component<AttendanceProps> {
    readonly state: State = {
    }
    signInFunc = async () => {
        const _res = await signIn(this.signInParams);
        Toast.info(_res.desc);
    }
    signInParams = {}
    loginFunc = async () => {
        const _res = await login();
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
            this.signInParams = {
                access_token,
                company_id,
                uuid,
                sign_time
            };
        } else {
            Toast.info(_res.desc);
        }
    }
    renderCanvas = () => {
        var scene = new THREE.Scene();
        
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        
        var renderer = new THREE.WebGLRenderer();
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor('#000',1.0);
        document.getElementById('box').appendChild(renderer.domElement);
        var geometry = new THREE.CubeGeometry(1,1,1);
        var material = new THREE.MeshBasicMaterial({color: "#ffffff"});
        var cube = new THREE.Mesh(geometry, material); scene.add(cube);
        camera.position.z = 5;
        function render() {
            requestAnimationFrame(render);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        render();
    }
    componentDidMount() {
        this.loginFunc();
        this.renderCanvas();
    }
    render() { 
        return (  
            <AttendanceStyled>
                <div id="box" className="box">
                    <MyIcons className="icon" onClick={ this.signInFunc } width="1.92" url={require('../../images/baseline_fingerprint_white_48.png')}/>
                </div>
            </AttendanceStyled>
        );
    }
}
 
export default Attendance;