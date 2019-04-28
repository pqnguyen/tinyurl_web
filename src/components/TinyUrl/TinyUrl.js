import React, {Component} from "react";
import {connect} from "react-redux";
import {Row, Col} from "antd";
import 'TinyUrl.css'

class TinyUrl extends Component {
    render() {
        return (
            <Row>
                <Col span={20}>Main</Col>
                <Col span={4}>Side Bar</Col>
            </Row>
        )
    }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(TinyUrl);