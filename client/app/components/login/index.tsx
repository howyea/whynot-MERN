import * as React from 'react';
import { Component } from 'react';
import { TextField, Button, Grid, Cell } from "react-md";
import { login } from "../../interface";

export interface LoginProps {
    
}
 
export interface LoginState {
    
}
 
class Login extends React.Component<LoginProps, LoginState> {
    state = { }
    componentDidMount () {
        login({
            username: 'admin',
            password: 'admin'
        });
    }
    render() { 
        return ( 
            <div>
                <TextField
                id="text-with-close-button"
                label="请输入账号"
                className="md-cell md-cell--bottom"
                />
                <TextField
                id="text-with-close-button"
                label="请输入密码"
                className="md-cell md-cell--bottom"
                />
                <Button className="md-cell md-cell--bottom" flat primary swapTheming>登录</Button>
            </div>
         );
    }
}
 
export default Login;