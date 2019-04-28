import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {redirectUrl} from "../Hash/HashActions";

class HashPage extends Component {
    constructor(props) {
        super(props);
        this.hash = props.match.params.hash;
    }

    componentDidMount() {
        if (this.hash) {
            this.props.redirectUrl(this.hash)
        }
    }

    render() {
        return (
            <div/>
        )
    }
}

const mapStateToProps = (state) => ({});

export default withRouter(connect(mapStateToProps, {
    redirectUrl,
})(HashPage));