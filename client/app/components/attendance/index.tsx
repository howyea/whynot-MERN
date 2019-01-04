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
        this.renderCanvas();
    }
    render() { 
        return (  
            <AttendanceStyled>
                <div id="box" className="box">
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