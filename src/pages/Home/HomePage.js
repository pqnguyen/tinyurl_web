import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Button, Card, Col, Input, Layout, Row, Spin} from "antd";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {
    FacebookIcon,
    FacebookShareButton,
    GooglePlusIcon,
    GooglePlusShareButton,
    TwitterIcon,
    TwitterShareButton
} from "react-share";

import config from "src/configs/configs"
import BaseHeader from "src/pages/Home/Components/BaseHeader/BaseHeader";
import {
    createFreeUrl
} from "src/pages/Home/HomeActions";

import 'src/App.css';

const {Content} = Layout;

const style_some_network = {
    'verticalAlign': 'top',
    'display': 'inline-block',
    'marginRight': '15px',
    'textAlign': 'center'
};

class HomePage extends Component {
    state = {
        value: '',
        copied: false,
    };

    handleShortenUrl = (value) => {
        this.setState({
            value: value
        });
        this.props.createFreeUrl(value)
    };

    getShortenUrl = (hash) => {
        return hash && `${config.CLIENT_URL}/${hash}`
    };

    renderShortenUrl = () => {
        if (this.props.isWaiting === true) {
            return (<Spin/>)
        }
        const shortenUrl = this.getShortenUrl(this.props.shortenUrl);
        return (<a href={shortenUrl} target="_blank"> {shortenUrl} </a>);
    };

    renderContent = () => {
        const shortenUrl = this.getShortenUrl(this.props.shortenUrl);
        return (
            <Content style={{padding: '0 50px', marginTop: 64}}>
                <Row>
                    <Col span={18}>
                        <div style={{background: '#fff', padding: 24, minHeight: 380}}>
                            <div style={{width: "70%"}}>
                                <Input.Search
                                    size="large"
                                    placeholder="Place a Long Url"
                                    enterButton="Shorten"
                                    onSearch={this.handleShortenUrl}
                                />
                            </div>
                            <div style={{marginTop: '20px', width: '70%'}}>
                                <Card style={{}}>
                                    <Row>
                                        <Col span={15}>
                                            {this.renderShortenUrl()}
                                        </Col>
                                        <Col span={9}>
                                            <div style={style_some_network}>
                                                <CopyToClipboard text={shortenUrl}
                                                                 onCopy={() => this.setState({copied: true})}>
                                                    <Button type="primary" shape="circle" icon="copy"/>
                                                </CopyToClipboard>
                                            </div>
                                            <div style={style_some_network}>
                                                <FacebookShareButton
                                                    url={this.state.value}
                                                    quote={`Click the link: ${shortenUrl} to go the page below !`}>
                                                    <FacebookIcon size={32} round/>
                                                </FacebookShareButton>
                                            </div>
                                            <div style={style_some_network}>
                                                <TwitterShareButton
                                                    url={this.state.value}
                                                    title={`Click the link: ${shortenUrl} to go the page below !`}
                                                    className="Demo__some-network__share-button">
                                                    <TwitterIcon size={32} round/>
                                                </TwitterShareButton>
                                            </div>
                                            <div style={style_some_network}>
                                                <GooglePlusShareButton url={this.state.value}>
                                                    <GooglePlusIcon size={32} round/>
                                                </GooglePlusShareButton>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{background: '#fff', padding: 24, minHeight: 380}}>
                            <Card style={{}}>
                                Welcome to shorten.vn. With shorten you can shorten your long link. We make it nicer and
                                shorter!
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Content>
        )
    };

    render() {
        return (
            <Layout>
                <BaseHeader/>
                {this.renderContent()}
            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    const {home} = state;
    return {
        isWaiting: home.isWaiting,
        shortenUrl: home.shortenUrl
    }
};

export default withRouter(connect(mapStateToProps, {
    createFreeUrl,
})(HomePage));
