import React, {Component} from "react";
import {Layout, Menu} from 'antd/lib/index';

const {Header} = Layout;

class BaseHeader extends Component {
    render() {
        return (
            <Header style={{position: 'fixed', zIndex: 1, width: '100%', height: '50px'}}>
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{lineHeight: '50px'}}
                >
                    <Menu.Item key="1">Home</Menu.Item>
                </Menu>
            </Header>
        )
    }
}

export default BaseHeader