// src/components/admin/Header.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Space, Button, Dropdown, Menu, Divider, Typography } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

// API Configuration
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const HeaderComponent = ({ collapsed, setCollapsed, setLogoutModalVisible }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch current user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get('/api/users/me');
      
      if (response.data.success) {
        setUserData(response.data.user);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!userData) return 'Guest';
    return `${userData.firstName} ${userData.lastName}`;
  };

  // Get user role display
  const getUserRole = () => {
    if (!userData) return 'Guest';
    return userData.type === 'admin' ? 'Administrator' : 
           userData.type === 'staff' ? 'Staff' : 'Customer';
  };

  // User menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/admin/profile')}>
        My Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate('/admin/settings')}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        danger
        onClick={() => setLogoutModalVisible(true)}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="!p-0 !h-16 shadow-sm !bg-white !z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="mr-4 text-teal-700 hover:text-teal-800"
          />
          <Divider type="vertical" className="h-6 mx-4" />
          <div className="ml-2">
            {loading ? (
              <div className="flex items-center">
                <LoadingOutlined className="text-teal-600" />
                <Text className="ml-2 text-teal-700">Loading...</Text>
              </div>
            ) : userData ? (
              <div className="flex flex-col">
                <Text className="text-teal-700">
                  Welcome back, <strong>{userData.firstName}</strong>
                </Text>
              </div>
            ) : (
              <Text className="text-teal-700">Welcome to Admin Panel</Text>
            )}
          </div>
        </div>

        <Space size="large" className="flex items-center h-full">
          {/* User Menu */}
          {loading ? (
            <div className="flex items-center">
              <Avatar size={36} icon={<LoadingOutlined />} className="border-2 border-teal-200" />
            </div>
          ) : userData ? (
            <Dropdown 
              overlay={userMenu} 
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="header-dropdown"
            >
              <div className="flex items-center h-full py-3 cursor-pointer">
                <Avatar
                  size={36}
                  src={userData.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  className="flex-shrink-0 border-2 border-teal-400"
                >
                  {!userData.profilePic && `${userData.firstName?.[0]}${userData.lastName?.[0]}`}
                </Avatar>
                {!collapsed && (
                  <div className="flex flex-col items-start min-w-0 ml-3">
                    <Text 
                      strong 
                      className="text-teal-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
                      title={getUserDisplayName()}
                    >
                      {getUserDisplayName()}
                    </Text>
                    <Text 
                      className="text-xs text-teal-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
                      title={getUserRole()}
                    >
                      {getUserRole()}
                    </Text>
                  </div>
                )}
              </div>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              className="bg-teal-600 border-0 hover:bg-teal-700"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </Space>
      </div>
    </Header>
  );
};

export default HeaderComponent;