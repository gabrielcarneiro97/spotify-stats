import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Card,
  Avatar,
  Skeleton,
  Button,
  Tooltip,
} from 'antd';
import PropTypes from 'prop-types';
import Flag from './Flag';

import { getUser, getRecs } from '../services/api.service';
import { auth } from '../services/auth.service';

const { Meta } = Card;

class UserInfos extends Component {
  static propTypes = {
    history: PropTypes.object, // eslint-disable-line
  }

  state = {
    user: {},
    loading: true,
  }

  async componentWillMount() {
    const { history } = this.props;
    try {
      const user = await getUser();
      this.setState({ user, loading: false });
    } catch (err) {
      auth().signOut(history);
      console.error(err);
    }
  }

  render() {
    const { loading, user } = this.state;

    const displayName = user.display_name;
    const { country, email } = user;
    const avatar = (() => {
      if (!user) return undefined;
      if (!user.images) return undefined;
      if (user.images.length > 0) {
        return user.images[0].url;
      }
      return undefined;
    })();

    const clickName = () => {
      if (!user) return undefined;
      if (user.external_urls) {
        return window.open(user.external_urls.spotify, '_blank');
      }
      return undefined;
    };
    return (
      <Card>
        <Skeleton loading={loading} avatar active>
          <Meta
            avatar={<Avatar size={64} src={avatar} />}
            title={(
              <Fragment>
                <Tooltip placement="bottom" title="Open at Spotify">
                  <Button type="link" size="large" onClick={clickName}>{displayName}</Button>
                </Tooltip>
                <Flag country={country} />
              </Fragment>
            )}
            description={(
              <div style={{
                paddingLeft: 15,
              }}
              >
                {email}
                <br />

              </div>
            )}
          />
        </Skeleton>
      </Card>
    );
  }
}

export default withRouter(UserInfos);
