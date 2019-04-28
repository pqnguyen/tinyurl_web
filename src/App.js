import React, {Component} from 'react';
import logo from 'src/logo.svg';
import 'src/App.css';
import BaseHeader from "./pages/Home/Components/BaseHeader/BaseHeader";
import {Col, Layout, Row} from "antd";
import BaseContent from "./pages/Home/Components/BaseContent/BaseContent";

class App extends Component {
    render() {
        return (
            <Layout>
                <BaseHeader/>
                <BaseContent/>
            </Layout>
        );
    }
}

export default App;
