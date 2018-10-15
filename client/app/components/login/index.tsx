import * as React from 'react';
import { Component } from 'react';
import { TextField, Button, Grid, Cell } from "react-md";
import { login } from "../../interface";

export interface LoginProps {
    
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
            <div>
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
                label="请输入密码"
                className="md-cell md-cell--bottom"
                onChange={( password: string ) => {
                    this.setState({
                        password
                    })
                }}
                />
                <Button className="md-cell md-cell--bottom" flat primary swapTheming onClick={() => {
                    const {
                        username,
                        password
                    } = this.state;
                    login({
                        username,
                        password
                    });
                }}>登录</Button>
            </div>
         );
    }
}
 
export default Login;