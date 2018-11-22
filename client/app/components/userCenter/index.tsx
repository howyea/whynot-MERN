import * as React from 'react';
import { Button } from "react-md";

export interface UserCenterProps {
    history: any
}
 
export interface UserCenterState {
    
}
 
class UserCenter extends React.Component<UserCenterProps, UserCenterState> {
    state = {

    }
    render() { 
        return ( 
            <div>
                <Button className="md-cell md-cell--bottom" flat primary swapTheming onClick={async() => {
                    localStorage.clear();
                    this.props.history.push('/main/login');
                }}>退出登录</Button>
            </div>
         );
    }
}
 
export default UserCenter;