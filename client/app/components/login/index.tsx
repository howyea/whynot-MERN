import * as React from 'react';
import { Component } from 'react';
import { TextField, Button, Grid, Cell } from "react-md";
import { login } from "../../interface";
import { LoginStyled } from "./styled";

export interface LoginProps {
    history: any
}
 
export interface LoginState {
    username: string,
    password: string
}
 
class Login extends React.Component<LoginProps, LoginState> {
    readonly state: LoginState = {
        username: '',
        password: ''
     }
    componentDidMount () {
        
    }
    render() { 
        return ( 
            <LoginStyled>
                <TextField
                id="text-with-close-button"
                label="请输入账号"
                className="md-cell md-cell--bottom"
                onChange={( username: string ) => {
                    
                    this.setState({
                        username
                    })
                }}
                />
                <TextField
                id="text-with-close-button"
                type="password"
                label="请输入密码"
                className="md-cell md-cell--bottom"
                onChange={( password: string ) => {
                    this.setState({
                        password
                    })
                }}
                />
                <Button className="md-cell md-cell--bottom" flat primary swapTheming onClick={async () => {
                    const {
                        username,
                        password
                    } = this.state;
                    const result = await login({
                        username,
                        password
                    });
                    if ( result.code === 0 ) {
                        localStorage.setItem('token', result.userInfo.token );
                        this.props.history.push('/main/app');
                    }
                }}>登录</Button>
                <div className="other">
                    <div className="forgetPassword">注册账号</div>
                </div>
            </LoginStyled>
         );
    }
}
 
export default Login;