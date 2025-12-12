// src/config/themeConfig.js
export const modernTealTheme = {
  token: {
    colorPrimary: '#08979c',
    colorSuccess: '#13c2c2',
    colorWarning: '#fa8c16',
    colorError: '#f5222d',
    colorInfo: '#08979c',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f6ffed',
    colorText: '#1d1d1f',
    colorTextSecondary: '#515153',
    colorBorder: '#d9d9d9',
    borderRadius: 10,
    fontSize: 14,
    boxShadow: '0 4px 12px rgba(8, 151, 156, 0.1)',
    boxShadowSecondary: '0 2px 8px rgba(8, 151, 156, 0.08)',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f6ffed',
      siderBg: '#ffffff',
    },
    Card: {
      borderRadiusLG: 14,
      boxShadow: '0 2px 12px rgba(8, 151, 156, 0.06)',
      colorBorder: 'rgba(8, 151, 156, 0.1)',
    },
    Button: {
      borderRadius: 10,
      colorPrimaryHover: '#006d75',
      colorPrimaryActive: '#00474f',
    },
    Input: {
      borderRadius: 10,
      hoverBorderColor: '#08979c',
      activeBorderColor: '#08979c',
    },
    Menu: {
      itemHoverBg: 'rgba(8, 151, 156, 0.04)',
      itemSelectedBg: 'rgba(8, 151, 156, 0.08)',
    },
  },
};