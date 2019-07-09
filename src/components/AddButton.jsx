import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  Row,
  Col,
  Select,
  Card,
  message,
} from 'antd';

import { Text } from './LanguageManager';
import IconFont from './IconFont';
import { addMusic } from '../services/api.service';

const { Option } = Select;

class AddButton extends Component {
  static propTypes = {
    track: PropTypes.object.isRequired, // eslint-disable-line
    playlists: PropTypes.array.isRequired // eslint-disable-line
  }

  state = {
    visible: false,
    confirmLoading: false,
    cardLoading: false,
    playlistSelectedId: '',
  };

  showModal = async () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = async () => {
    this.setState({
      confirmLoading: true,
    }, async () => {
      const { playlistSelectedId } = this.state;

      if (playlistSelectedId === '') {
        message.error('Selecione uma playlist!');
        this.setState({
          confirmLoading: false,
        });
      } else {
        try {
          const { track } = this.props;
          await addMusic(playlistSelectedId, track.uri);

          message.success('Música Adicionada com sucesso!');
          this.setState({
            confirmLoading: false,
            visible: false,
          });
        } catch (err) {
          message.error('Ocorreu um erro ao adicionar a música, tente novamente mais tarde :(');
          this.setState({
            confirmLoading: false,
            visible: false,
          });
          console.error(err);
        }
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSelectChange = (value) => {
    this.setState({ playlistSelectedId: value });
  }

  render() {
    const { track, playlists } = this.props;
    const {
      visible,
      confirmLoading,
      cardLoading,
    } = this.state;

    const select = (
      <Select style={{ width: '100%' }} onChange={this.handleSelectChange}>
        {playlists.map(p => <Option disabled={!p.editable} key={`${p.id}-${track.id}`} value={p.id}>{p.name}</Option>)}
      </Select>
    );
    return (
      <Fragment>
        <Modal
          title={<Text dicio={{ pt: 'Adicionar Música', en: 'Add Track' }} />}
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Card bordered={false} loading={cardLoading} bodyStyle={{ padding: 0 }}>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Text
                  dicio={{
                    pt: `Selecione uma playlist para adicionar ${track.name} de ${track.artist.name}`,
                    en: `Select a playlist to add ${track.name} from ${track.artist.name}`,
                  }}
                />
              </Col>
            </Row>
            <Row type="flex" justify="center" align="middle" style={{ marginTop: '2vh' }}>
              <Col span={12}>
                {select}
              </Col>
            </Row>
          </Card>
        </Modal>
        <Button type="link" onClick={this.showModal}>
          <IconFont type="icon-list-add" />
          &nbsp;
          Adicionar a playlist
        </Button>
      </Fragment>
    );
  }
}

export default AddButton;
