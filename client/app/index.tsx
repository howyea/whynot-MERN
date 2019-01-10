import * as React from "react";
import * as ReactDOM from "react-dom";
import {BrowserRouter as Router, Redirect, Switch, Route} from 'react-router-dom';
import 'antd-mobile/dist/antd-mobile.css';
import Main from './components/Main';
import Ad from "./components/ad";
import Login from "./components/login";


ReactDOM.render(
        <Router>
            <Switch>
                <Route path="/main" component={Main} />
                <Route exact path="/mobile" component={Ad}/>
            </Switch>
        </Router>,
    document.getElementById('app')
)
