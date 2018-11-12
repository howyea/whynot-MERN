import * as React from 'react';
import { Component } from 'react';
import { Button } from "react-md";

export interface UserCenterProps {
    
}
 
export interface UserCenterState {
    
}
 
class UserCenter extends React.Component<UserCenterProps, UserCenterState> {
    render() { 
        return ( 
            <div>
                <Button className="md-cell md-cell--bottom" flat primary swapTheming onClick={async () => {
                    
                }}>退出登录</Button>
            </div>
         );
    }
}
 
export default UserCenter;