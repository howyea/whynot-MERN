import * as React from 'react';
import { Component } from 'react';
import { Toast } from "antd-mobile";
import { AttendanceStyled } from "./styled";
import { MyIcons } from "../styled";
import { login, signIn } from "./interface";
export interface AttendanceProps {
    
}
 
export interface AttendanceState {
    
}
 
class Attendance extends React.Component<AttendanceProps, AttendanceState> {
    state = { 

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
    componentDidMount() {
        this.loginFunc();
    }
    render() { 
        return (  
            <AttendanceStyled>
                <div className="box">
                    <MyIcons onClick={ this.signInFunc } width="1.92" url={require('../../images/baseline_fingerprint_white_48.png')}/>
                </div>
            </AttendanceStyled>
        );
    }
}
 
export default Attendance;