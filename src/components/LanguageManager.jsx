import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import Flag from './Flag';

const { Option } = Select;

const LanguageContext = React.createContext();
export const LanguageConsumer = LanguageContext.Consumer;

export class LanguageProvider extends React.Component {
  state = {
    language: 'pt',
  };

  updateLanguage = value => this.setState({ language: value });

  render() {
    return (
      <LanguageContext.Provider
        value={{
          language: this.state.language,
          updateLanguage: this.updateLanguage
        }}
      >
        {this.props.children}
      </LanguageContext.Provider>
    );
  }
}

export const LanguageSelect = () => (
  <LanguageConsumer>
    {({ updateLanguage }) => (
      <Select size="small" defaultValue="pt" onChange={updateLanguage} style={{ width: 100 }}>
        <Option value="pt">
          <Flag country="BR" />
          &nbsp;
          PT-BR
        </Option>
        <Option value="en">
          <Flag country="US" />
          &nbsp;
          EN-US
        </Option>
      </Select>
    )}
  </LanguageConsumer>
);

export const Text = props => (
  <LanguageConsumer>{({ language }) => props.dicio[language]}</LanguageConsumer>
);

Text.propTypes = {
  dicio: PropTypes.object.isRequired // eslint-disable-line
};
