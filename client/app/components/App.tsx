/*
 * @Author: Micheal.Ye 
 * @Date: 2018-03-09 14:10:51 
 * @Last Modified by: Micheal.Ye
 * @Last Modified time: 2018-11-22 10:38:53
 */
import * as React from 'react'
import { Route } from 'react-router-dom';
import { BottomNavigation, FontIcon } from 'react-md';
import Blogs from "./blogs";
import UserCenter from "./userCenter";
import Attendance from "./attendance";

const links = [{
    label: '首页',
    icon: <FontIcon>store</FontIcon>,
  }, {
    label: '服务中心',
    icon: <FontIcon>view_comfy</FontIcon>,
  }, {
    label: '个人中心',
    icon: <FontIcon>account_circle</FontIcon>,
  }];
interface ListKey {
    title: string,
    description: string,
    content: string
}
export interface AppProps {
    history: any
}
 
export interface AppState {
    
}
 
class App extends React.Component<AppProps, AppState> {
    handleNavChange = (activeIndex) => {
        switch (activeIndex) {
            case 0:
                this.props.history.push('/main/app')
                break;
            case 1:
                this.props.history.push('/main/app/attendance')
                break;
            default:
                this.props.history.push('/main/app/userCenter')
        }
    };
    render() {
        return (
            <div>
                    <Route exact path="/main/app" component={Blogs} />
                    <Route path="/main/app/userCenter" component={UserCenter} />
                    <Route path="/main/app/attendance" component={Attendance} />
                <BottomNavigation links={links} dynamic={true}  onNavChange={this.handleNavChange}/>
            </div>
        )
    }
}

export default App;