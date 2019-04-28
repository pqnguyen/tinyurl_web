import React from 'react';
import {Route, Switch} from 'react-router-dom';
import pagePaths from "src/constants/pagePaths";
import Main from "src/layout/Main/Main";

const routes = (
    <Switch>
        <Route path={pagePaths.HOME} component={Main}/>
    </Switch>
);

export default routes;
