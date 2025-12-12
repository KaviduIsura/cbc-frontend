// src/components/admin/Header.jsx
import React from 'react';
import { Layout, Avatar, Space, Button, Badge, Dropdown, Menu, Divider, Switch, Typography } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  MessageOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

const HeaderComponent = ({ collapsed, setCollapsed, isDarkMode, setIsDarkMode, setLogoutModalVisible }) => {
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        My Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
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

  const notificationsMenu = (
    <Menu>
      <Menu.Item key="1">
        <div className="flex items-center">
          <Avatar size="small" className="mr-3 bg-teal-500">
            <BellOutlined />
          </Avatar>
          <div>
            <Text strong>New Order Received</Text>
            <div className="text-xs text-gray-500">5 minutes ago</div>
          </div>
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <div className="flex items-center">
          <Avatar size="small" className="mr-3 bg-blue-500">
            <MessageOutlined />
          </Avatar>
          <div>
            <Text strong>New Message</Text>
            <div className="text-xs text-gray-500">1 hour ago</div>
          </div>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="!p-0 !h-16 shadow-sm !bg-white">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="mr-4 text-teal-700 hover:text-teal-800"
          />
          <Divider type="vertical" className="h-6" />
          <Text className="ml-4 text-teal-700">
            Welcome back, <strong>Alexander</strong>
          </Text>
        </div>

        <Space size="large">
          {/* Theme Toggle */}
          <div className="flex items-center">
            <Text className="mr-2 text-teal-700">
              {isDarkMode ? "Dark" : "Light"}
            </Text>
            <Switch
              checked={isDarkMode}
              onChange={setIsDarkMode}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />
          </div>

          {/* Notifications */}
          <Dropdown overlay={notificationsMenu} trigger={["click"]}>
            <Badge count={5} size="small" offset={[-2, 2]}>
              <Button
                type="text"
                icon={<BellOutlined />}
                shape="circle"
                className="text-teal-700 hover:text-teal-800"
              />
            </Badge>
          </Dropdown>

          {/* Messages */}
          <Badge count={3} size="small" offset={[-2, 2]}>
            <Button
              type="text"
              icon={<MessageOutlined />}
              shape="circle"
              className="text-teal-700 hover:text-teal-800"
            />
          </Badge>

          {/* User Menu */}
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <div className="flex items-center cursor-pointer">
              <Avatar
                size={36}
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="border-2 border-teal-400"
              />
              {!collapsed && (
                <div className="ml-3">
                  <Text strong className="text-teal-800">
                    Alexander Chen
                  </Text>
                  <Text className="block text-xs text-teal-600">
                    Super Admin
                  </Text>
                </div>
              )}
            </div>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default HeaderComponent;