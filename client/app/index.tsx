import * as React from "react";
import * as ReactDOM from "react-dom";

// import { Hello } from "./components/Hello";
import {BrowserRouter as Router, Redirect, Switch, Route} from 'react-router-dom';
import App from './components/App';
import Ad from "./components/ad";
import Login from "./components/login";


ReactDOM.render(
        <Router>
            <Switch>
                <Route path="/app" component={App} />
                <Route path="/login" component={Login} />
                <Route exact path="/" component={Ad}/>
            </Switch>
        </Router>,
    document.getElementById('app')
)

// ReactDOM.render(
//     <div>sagag</div>,
//     // <Hello compiler="TypeScript" framework="React" />,
//     document.getElementById("app")
// );
