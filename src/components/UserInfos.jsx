import React, { Component } from 'react';
import { Spin } from 'antd';
import { getUser } from '../services/api.service';

class UserInfos extends Component {
  state = {
    user: {},
    loading: true,
  }

  async componentWillMount() {
    const user = await getUser();

    this.setState({ user, loading: false });
  }

  render() {
    const { state } = this;
    const { loading, user } = state;
    return (
      <Spin spinning={loading}>
        <div>{JSON.stringify(user)}</div>
      </Spin>
    );
  }
}

export default UserInfos;
