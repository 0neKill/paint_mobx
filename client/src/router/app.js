import React from "react";
import {Switch, Route, Redirect} from 'react-router-dom';

import '../styles/app.scss';

import {Canvas, SettingBar, ToolBar} from "../components";

export const App = () => {
    return (
        <div className='app'>
            <Switch>
                <Route exact path={'/:id'}>
                    <ToolBar/>
                    <SettingBar/>
                    <Canvas/>
                </Route>
                <Redirect to={`f${(+new Date()).toString(16)}`}/>
            </Switch>

        </div>
    )
}