import React, {Component} from "react";
import {connect} from "react-redux";
import {Route, Switch, withRouter} from "react-router-dom";

import routeMapping from "src/routes/routeMapping";

class Main extends Component {
    constructor(props) {
        super(props);

        const staticRoutes = routeMapping.map(({path, component}) => (
            <Route key={path} exact path={path} component={component}/>
        ));

        this.routes = [...staticRoutes];
    }

    render() {
        return (
            <div style={{minHeight: "100vh", minWidth: "1380px"}}>
                <Switch>
                    {this.routes}
                </Switch>
            </div>
        );
    }
}

export default withRouter(connect()(Main));
