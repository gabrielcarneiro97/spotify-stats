import React from 'react';

import '../assets/iconfont/iconfont.css';

function IconFont({ type, ...rest }) {
  return <span {...rest} className={`iconfont icon-${type}`} />;
}

export default IconFont;
