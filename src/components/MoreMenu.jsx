import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  List,
  Card,
  Row,
  Col,
} from 'antd';


// import { Text } from './LanguageManager';
import defaultImg from '../assets/default-cover.png';

import AddButton from './AddButton';

const linkClick = link => () => window.open(link, '_blank');

class MoreMenu extends Component {
  static propTypes = {
    track: PropTypes.object.isRequired, // eslint-disable-line
    playlists: PropTypes.array.isRequired // eslint-disable-line
  }

  state = {
    visible: false,
    cardLoading: false,
  };

  showModal = async () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { track, playlists } = this.props;
    const {
      visible,
      cardLoading,
    } = this.state;

    const list = [
      <AddButton track={track} playlists={playlists} />,
      <Button
        type="link"
        size="large"
        onClick={linkClick(track.spotifyLink)}
        icon="export"
      >
        Ver Música no Spotify
      </Button>,
      <Button
        type="link"
        size="large"
        onClick={linkClick(track.artist ? track.artist.spotifyLink : '')}
        icon="user"
      >
        Ver Artista no Spotify
      </Button>,
      <Button
        type="link"
        size="large"
        onClick={linkClick(track.album ? track.album.spotifyLink : '')}
        icon="appstore"
      >
        Ver Álbum no Spotify
      </Button>,
    ];

    return (
      <Fragment>
        <Modal
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Card
            bordered={false}
            loading={cardLoading}
            bodyStyle={{ padding: 0 }}
          >
            <Row type="flex" justify="center" align="top">
              <Col>
                <img
                  alt="cover"
                  src={track.album ? track.album.cover : defaultImg}
                  width={128}
                  style={{
                    borderRadius: '5px',
                  }}
                />
              </Col>
            </Row>
            <Row type="flex" justify="center" align="top">
              <Col style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bolder' }}>{track.name}</div>
                <div>{track.artist ? track.artist.name : ''}</div>
              </Col>
            </Row>
            <Row type="flex" justify="center" align="top">
              <Col span={23}>
                <List
                  style={{ marginTop: '10px' }}
                  dataSource={list}
                  renderItem={item => (
                    <List.Item>
                      {item}
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
          </Card>
        </Modal>
        <Button shape="circle" onClick={this.showModal} icon="more" size="small" />
      </Fragment>
    );
  }
}

export default MoreMenu;
