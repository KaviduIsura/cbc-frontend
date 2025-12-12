// src/components/admin/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Avatar, Typography, Input, Badge, Button, Tooltip, Dropdown } from 'antd';
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
  ProfileOutlined,
  KeyOutlined,
  EditOutlined
} from "@ant-design/icons";
import axios from 'axios';

const { Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

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

const Sidebar = ({ collapsed, onLogoutClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/').pop() || 'dashboard';
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeOrders: 0,
    newReviews: 0
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
    fetchStats();
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
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats for sidebar
  const fetchStats = async () => {
    try {
      // You would fetch real stats from your API
      // For now, using mock data
      setStats({
        activeOrders: 12,
        newReviews: 3
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData) return 'U';
    return `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`;
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!userData) return 'User';
    return `${userData.firstName} ${userData.lastName}`;
  };

  // Get user role display
  const getUserRole = () => {
    if (!userData) return 'Guest';
    return userData.type === 'admin' ? 'Administrator' : 
           userData.type === 'staff' ? 'Staff' : 'Customer';
  };

  // User dropdown menu for sidebar (collapsed mode)
  const userMenu = (
    <Menu style={{ zIndex: 9999 }}>
      <Menu.Item key="profile" icon={<ProfileOutlined />} onClick={() => navigate('/admin/profile')}>
        My Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate('/admin/settings')}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={onLogoutClick}>
        Logout
      </Menu.Item>
    </Menu>
  );

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
      badge: stats.activeOrders,
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
      badge: stats.newReviews,
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
      key: "profile",
      icon: <ProfileOutlined className="text-lg" />,
      label: "My Profile",
      path: "/admin/profile",
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
        zIndex: 40,
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
        <div className="p-4 mx-4 my-4 bg-teal-50 rounded-xl">
          {loading ? (
            <div className="flex items-center space-x-3">
              <Avatar size={40} className="bg-teal-100 border-2 border-white shadow-sm">
                <UserOutlined className="text-teal-600" />
              </Avatar>
              <div>
                <Text strong className="!text-teal-800 text-sm">
                  Loading...
                </Text>
                <div className="flex items-center">
                  <div className="w-2 h-2 mr-2 bg-gray-400 rounded-full"></div>
                  <Text className="text-xs text-teal-500">
                    Loading role...
                  </Text>
                </div>
              </div>
            </div>
          ) : userData ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Avatar
                  size={40}
                  src={userData.profilePic}
                  className="bg-teal-100 border-2 border-white shadow-sm"
                >
                  {getUserInitials()}
                </Avatar>
                <div>
                  <Text strong className="!text-teal-800 text-sm block">
                    {getUserDisplayName()}
                  </Text>
                  <div className="flex items-center">
                    <div className="w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                    <Text className="text-xs text-teal-500">
                      {getUserRole()}
                    </Text>
                  </div>
                </div>
              </div>
              
              {/* Quick Profile Actions */}
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-teal-100">
                <Button 
                  type="text" 
                  size="small" 
                  icon={<EditOutlined />}
                  onClick={() => navigate('/admin/profile')}
                  className="text-teal-600 hover:text-teal-700 hover:bg-teal-100"
                >
                  Edit Profile
                </Button>
                {/* <Button 
                  type="text" 
                  size="small" 
                  icon={<KeyOutlined />}
                  onClick={() => navigate('/admin/profile?tab=password')}
                  className="text-teal-600 hover:text-teal-700 hover:bg-teal-100"
                >
                  Change Password
                </Button> */}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Avatar size={40} className="bg-teal-100 border-2 border-white shadow-sm">
                <UserOutlined className="text-teal-600" />
              </Avatar>
              <div>
                <Text strong className="!text-teal-800 text-sm">
                  Not Logged In
                </Text>
                <Button 
                  type="link" 
                  size="small" 
                  onClick={() => navigate('/login')}
                  className="!p-0 !h-auto text-teal-600 hover:text-teal-700"
                >
                  Click to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center my-4">
          {loading ? (
            <Avatar size={40} className="bg-teal-100 border-2 border-white shadow-sm">
              <UserOutlined className="text-teal-600" />
            </Avatar>
          ) : userData ? (
            <Dropdown 
              overlay={userMenu} 
              trigger={["click"]}
              placement="rightTop"
              overlayStyle={{ 
                zIndex: 9999,
                position: 'fixed'
              }}
            >
              <Avatar
                size={40}
                src={userData.profilePic}
                className="bg-teal-100 border-2 border-white shadow-sm cursor-pointer"
              >
                {getUserInitials()}
              </Avatar>
            </Dropdown>
          ) : (
            <Avatar 
              size={40} 
              className="bg-teal-100 border-2 border-white shadow-sm cursor-pointer"
              onClick={() => navigate('/login')}
            >
              <UserOutlined className="text-teal-600" />
            </Avatar>
          )}
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
                <Badge count={stats.activeOrders} size="small" style={{ backgroundColor: '#08979c' }} />
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-xs text-teal-600">New Reviews</Text>
                <Badge count={stats.newReviews} size="small" style={{ backgroundColor: '#08979c' }} />
              </div>
              {userData && (
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-teal-200">
                  <Text className="text-xs text-teal-600">Last Login</Text>
                  <Text className="text-xs font-medium text-teal-700">
                    {userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'Today'}
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collapsed Mode Quick Actions */}
        {collapsed && (
          <div className="flex flex-col items-center px-2 py-4 space-y-4">
            <Badge count={stats.activeOrders} size="small" style={{ backgroundColor: '#08979c' }}>
              <ShoppingCartOutlined className="text-lg text-teal-600" />
            </Badge>
            <Badge count={stats.newReviews} size="small" style={{ backgroundColor: '#08979c' }}>
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
              loading={loading}
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
                loading={loading}
              />
            </Tooltip>
          </div>
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;