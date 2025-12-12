// src/components/ConfigProviderWrapper.jsx
import React from 'react';
import { ConfigProvider } from 'antd';
import { modernTealTheme } from '../config/themeConfig';

const ConfigProviderWrapper = ({ children }) => {
  return (
    <ConfigProvider theme={modernTealTheme}>
      {children}
    </ConfigProvider>
  );
};

export default ConfigProviderWrapper;