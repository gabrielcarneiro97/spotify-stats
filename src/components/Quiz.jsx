import React, { Component } from 'react';
import { Layout, Modal, message } from 'antd';

import QuizGame from './QuizGame';
import QuizEnd from './QuizEnd';

import { Text } from './LanguageManager';

import { getPlaylistQuiz, createPlaylist } from '../services/api.service';

const { Content } = Layout;

const { confirm } = Modal;


class Quiz extends Component {
  state = {
    showGame: true,
  };

  handleEnd = async (ans) => {
    this.setState({ showGame: false });
    const { allTracks: tracksEnd } = await getPlaylistQuiz(ans);
    this.setState({ tracksEnd });
  }

  showConfirm = (nameParam, tracks) => {
    const playlistName = nameParam.trim() || 'Meu Quiz Statsfy';
    confirm({
      title: 'Você tem certeza que deseja criar essa playlist?',
      content: `Após confirmar a playlist "${playlistName}" será criada em seu Spotify com as músicas sugeridas`,
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      async onOk() {
        try {
          await createPlaylist(playlistName, tracks);
          message.success('Playlist criada com sucesso!');
        } catch (err) {
          message.error('Ocorreu um erro na criação da playlist, tente novamente mais tarde :(');
        }
      },
    });
  }

  handleSend = async (playlistName) => {
    const { tracksEnd } = this.state;
    this.showConfirm(playlistName, tracksEnd);
  }

  render() {
    const { showGame, tracksEnd } = this.state;
    return (
      <Content style={{ minHeight: '92vh' }}>
        <div style={{ display: showGame ? 'block' : 'none' }}>
          <QuizGame onEnd={this.handleEnd} />
        </div>
        <div style={{ display: showGame ? 'none' : 'block' }}>
          <QuizEnd tracks={tracksEnd} clickSend={this.handleSend} />
        </div>
      </Content>
    );
  }
}

export default Quiz;
