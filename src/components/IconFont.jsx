import PropTypes from 'prop-types';
import { Icon } from 'antd';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1286077_ulyvwlstu1.js',
});

IconFont.propTypes = {
  type: PropTypes.string.isRequired,
};

export default IconFont;
