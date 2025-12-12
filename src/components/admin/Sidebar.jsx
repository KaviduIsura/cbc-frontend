// src/components/admin/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Typography, Input, Badge, Button, Tooltip } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  StarOutlined,
  BarChartOutlined,
  GiftOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  BellOutlined,
  LogoutOutlined,
  PoweroffOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const Sidebar = ({ collapsed, isDarkMode, onLogoutClick }) => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined className="text-lg" />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      key: "products",
      icon: <ShoppingOutlined className="text-lg" />,
      label: "Products",
      path: "/admin/products",
      children: [
        {
          key: "all-products",
          label: "All Products",
          path: "/admin/products",
        },
        {
          key: "add-product",
          label: "Add Product",
          path: "/admin/products/add",
        },
        {
          key: "categories",
          label: "Categories",
          path: "/admin/categories",
        },
      ],
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined className="text-lg" />,
      label: "Orders",
      path: "/admin/orders",
      badge: 12,
    },
    {
      key: "customers",
      icon: <UserOutlined className="text-lg" />,
      label: "Customers",
      path: "/admin/customers",
    },
    {
      key: "admins",
      icon: <TeamOutlined className="text-lg" />,
      label: "Team",
      path: "/admin/admins",
    },
    {
      key: "reviews",
      icon: <StarOutlined className="text-lg" />,
      label: "Reviews",
      path: "/admin/reviews",
      badge: 3,
    },
    {
      key: "analytics",
      icon: <BarChartOutlined className="text-lg" />,
      label: "Analytics",
      path: "/admin/analytics",
    },
    {
      key: "promotions",
      icon: <GiftOutlined className="text-lg" />,
      label: "Promotions",
      path: "/admin/promotions",
    },
    {
      key: "settings",
      icon: <SettingOutlined className="text-lg" />,
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  const renderMenuItem = (item) => {
    const isActive = currentPath === item.key;
    
    if (item.children) {
      return {
        key: item.key,
        icon: item.icon,
        label: collapsed ? item.icon : (
          <div className="flex items-center justify-between">
            <span>{item.label}</span>
            {item.badge && (
              <Badge count={item.badge} size="small" style={{ backgroundColor: '#08979c' }} />
            )}
          </div>
        ),
        children: item.children.map(child => ({
          key: child.key,
          label: <Link to={child.path}>{child.label}</Link>,
        })),
      };
    }

    return {
      key: item.key,
      icon: item.icon,
      label: (
        <Link to={item.path} className="flex items-center justify-between">
          <span>{item.label}</span>
          {item.badge && !collapsed && (
            <Badge count={item.badge} size="small" style={{ backgroundColor: '#08979c' }} />
          )}
        </Link>
      ),
      style: {
        margin: '4px 8px',
        borderRadius: '8px',
        backgroundColor: isActive ? 'rgba(8, 151, 156, 0.1)' : 'transparent',
      },
    };
  };

  return (
    <Sider
      width={280}
      collapsedWidth={80}
      collapsible
      collapsed={collapsed}
      className="shadow-lg transition-all duration-300 !bg-white !border-r !border-teal-100 flex flex-col"
      breakpoint="lg"
      trigger={null}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-teal-100">
        <div className="flex items-center justify-center">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600">
                <SafetyCertificateOutlined className="text-xl text-white" />
              </div>
              <div>
                <Title level={4} className="!mb-0 !text-teal-800 !font-semibold">
                  Elevé
                </Title>
                <Text className="text-xs font-medium text-teal-500">
                  ADMIN PANEL
                </Text>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600">
              <SafetyCertificateOutlined className="text-xl text-white" />
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      {!collapsed ? (
        <div className="p-4 mx-4 my-6 bg-teal-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <Avatar
              size={40}
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="border-2 border-white shadow-sm"
            />
            <div>
              <Text strong className="!text-teal-800 text-sm">
                Alexander Chen
              </Text>
              <div className="flex items-center">
                <div className="w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                <Text className="text-xs text-teal-500">
                  Super Admin
                </Text>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center my-6">
          <Avatar
            size={40}
            src="https://randomuser.me/api/portraits/men/32.jpg"
            className="border-2 border-white shadow-sm"
          />
        </div>
      )}

      {/* Search Bar */}
      {!collapsed && (
        <div className="px-4 mb-4">
          <Search
            placeholder="Search menu..."
            className="rounded-lg"
            size="middle"
            allowClear
            prefix={<SearchOutlined className="text-teal-400" />}
          />
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-1 px-2 py-2 overflow-y-auto">
        <Menu
          mode="inline"
          className="!border-none !bg-transparent"
          defaultSelectedKeys={["dashboard"]}
          selectedKeys={[currentPath]}
          items={menuItems.map(renderMenuItem)}
          style={{
            borderRight: 'none',
          }}
        />
      </div>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-teal-100">
        {/* Quick Stats */}
        {!collapsed && (
          <div className="p-4 mx-4 my-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Text className="text-xs text-teal-600">Active Orders</Text>
                <Badge count={12} size="small" style={{ backgroundColor: '#08979c' }} />
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-xs text-teal-600">New Reviews</Text>
                <Badge count={3} size="small" style={{ backgroundColor: '#08979c' }} />
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Mode Quick Actions */}
        {collapsed && (
          <div className="flex flex-col items-center px-2 py-4 space-y-4">
            <Badge count={12} size="small" style={{ backgroundColor: '#08979c' }}>
              <ShoppingCartOutlined className="text-lg text-teal-600" />
            </Badge>
            <Badge count={3} size="small" style={{ backgroundColor: '#08979c' }}>
              <BellOutlined className="text-lg text-teal-600" />
            </Badge>
          </div>
        )}

        {/* Logout Button */}
        {!collapsed ? (
          <div className="p-4">
            <Button
              type="default"
              danger
              icon={<LogoutOutlined />}
              onClick={onLogoutClick}
              className="w-full text-red-500 border-teal-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              size="large"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <Tooltip title="Logout" placement="right">
              <Button
                type="text"
                danger
                icon={<PoweroffOutlined />}
                onClick={onLogoutClick}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                size="large"
                shape="circle"
              />
            </Tooltip>
          </div>
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;