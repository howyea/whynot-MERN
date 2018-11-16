import * as React from 'react';
import { Route } from 'react-router-dom';
import { Header, MyIcons } from "./styled";
import App from './App';
import Login from "./login";
export interface MainProps {
    
}
 
export interface MainState {
    
}
 
class Main extends React.Component<MainProps, MainState> {
    state = { 

      }
    render() { 
        return ( 
            <div>
                 <Header>
                    <MyIcons width="1" url={require('../images/logo.png')}></MyIcons>
                </Header>
                <Route path="/main/app" component={App} />
                <Route path="/main/login" component={Login} />
            </div>
         );
    }
}
 
export default Main;