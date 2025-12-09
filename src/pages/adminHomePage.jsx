import { useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  UserOutlined, 
  TeamOutlined,
  StarOutlined,
  PieChartOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  RiseOutlined,
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
  MessageOutlined,
  FileTextOutlined,
  GlobalOutlined,
  BarChartOutlined,
  GiftOutlined,
  TagOutlined,
  WalletOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import { 
  Layout, 
  Menu, 
  Card, 
  Statistic, 
  Row, 
  Col, 
  Avatar,
  Progress,
  Table,
  Tag,
  Button,
  Space,
  Timeline,
  Badge,
  List,
  Tooltip,
  Dropdown,
  theme,
  Typography,
  Modal,
  Input,
  Divider,
  Switch,
  FloatButton
} from "antd";
const { Title, Text } = Typography;
const { Search } = Input;

import AdminProductsPage from "./admin/adminProductsPage";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProductForm";
import AdminUsersPage from "./admin/adminUsersPage";
import AddUserForm from "./admin/addAdminForm";
import AdminAdminstratorPage from "./admin/adminAdminsitratorPage";
import AdminReviewPage from "./admin/adminReviewPage";

const { Header, Sider, Content } = Layout;
const { Meta } = Card;

export default function AdminHomePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login page
    navigate("/login");
    setLogoutModalVisible(false);
  };

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
          <Avatar size="small" className="mr-3 bg-blue-500">
            <ShoppingCartOutlined />
          </Avatar>
          <div>
            <Text strong>New Order Received</Text>
            <div className="text-xs text-gray-500">5 minutes ago</div>
          </div>
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <div className="flex items-center">
          <Avatar size="small" className="mr-3 bg-green-500">
            <StarOutlined />
          </Avatar>
          <div>
            <Text strong>New Product Review</Text>
            <div className="text-xs text-gray-500">1 hour ago</div>
          </div>
        </div>
      </Menu.Item>
      <Menu.Item key="3">
        <div className="flex items-center">
          <Avatar size="small" className="mr-3 bg-orange-500">
            <UserOutlined />
          </Avatar>
          <div>
            <Text strong>New Customer Registered</Text>
            <div className="text-xs text-gray-500">2 hours ago</div>
          </div>
        </div>
      </Menu.Item>
    </Menu>
  );

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined className="text-lg" />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined className="text-lg" />,
      label: <Link to="/admin/products">Products</Link>,
      children: [
        { key: 'all-products', label: <Link to="/admin/products">All Products</Link> },
        { key: 'add-product', label: <Link to="/admin/products/add">Add Product</Link> },
        { key: 'categories', label: <Link to="/admin/categories">Categories</Link> },
        { key: 'inventory', label: <Link to="/admin/inventory">Inventory</Link> },
      ]
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined className="text-lg" />,
      label: <Link to="/admin/orders">Orders</Link>,
      children: [
        { key: 'all-orders', label: <Link to="/admin/orders">All Orders</Link> },
        { key: 'pending', label: <Link to="/admin/orders/pending">Pending</Link> },
        { key: 'completed', label: <Link to="/admin/orders/completed">Completed</Link> },
        { key: 'cancelled', label: <Link to="/admin/orders/cancelled">Cancelled</Link> },
      ]
    },
    {
      key: 'customers',
      icon: <UserOutlined className="text-lg" />,
      label: <Link to="/admin/customers">Customers</Link>,
    },
    {
      key: 'admins',
      icon: <TeamOutlined className="text-lg" />,
      label: <Link to="/admin/admins">Administrators</Link>,
      children: [
        { key: 'all-admins', label: <Link to="/admin/admins">All Admins</Link> },
        { key: 'add-admin', label: <Link to="/admin/admins/add">Add Admin</Link> },
        { key: 'roles', label: <Link to="/admin/roles">Roles & Permissions</Link> },
      ]
    },
    {
      key: 'reviews',
      icon: <StarOutlined className="text-lg" />,
      label: <Link to="/admin/reviews">Reviews</Link>,
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined className="text-lg" />,
      label: <Link to="/admin/analytics">Analytics</Link>,
    },
    {
      key: 'promotions',
      icon: <GiftOutlined className="text-lg" />,
      label: <Link to="/admin/promotions">Promotions</Link>,
      children: [
        { key: 'coupons', label: <Link to="/admin/coupons">Coupons</Link> },
        { key: 'discounts', label: <Link to="/admin/discounts">Discounts</Link> },
        { key: 'campaigns', label: <Link to="/admin/campaigns">Campaigns</Link> },
      ]
    },
    {
      key: 'settings',
      icon: <SettingOutlined className="text-lg" />,
      label: <Link to="/admin/settings">Settings</Link>,
    },
  ];

  return (
    <Layout className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sider
        width={280}
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className={`shadow-2xl transition-all duration-300 ${
          isDarkMode 
            ? '!bg-gradient-to-b !from-gray-900 !to-gray-800 !border-r !border-gray-700' 
            : '!bg-gradient-to-b !from-indigo-900 !to-purple-900'
        }`}
        breakpoint="lg"
        trigger={null}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white border-opacity-20">
          <div className="flex items-center justify-center">
            {!collapsed ? (
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500">
                  <SafetyCertificateOutlined className="text-2xl text-white" />
                </div>
                <div className="ml-4">
                  <Title level={4} className="!mb-0 !text-white">ELEVÉ ADMIN</Title>
                  <Text className="text-xs text-blue-200">Premium Dashboard</Text>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-12 h-12 mx-auto shadow-lg rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500">
                <SafetyCertificateOutlined className="text-2xl text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {!collapsed && (
          <div className="px-4 py-6">
            <Search
              placeholder="Search..."
              className="bg-white/10 border-white/20"
              size="large"
              style={{ color: 'white' }}
            />
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex-1 py-4 overflow-y-auto">
          <Menu
            theme="dark"
            mode="inline"
            className={`!bg-transparent !border-none ${collapsed ? '!px-2' : ''}`}
            defaultSelectedKeys={['dashboard']}
            items={menuItems}
          />
        </div>

        {/* User Profile */}
        <div className="p-6 border-t border-white border-opacity-20">
          <div className="flex items-center">
            <Avatar 
              size={collapsed ? 40 : 48} 
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="border-2 border-cyan-400"
            />
            {!collapsed && (
              <div className="ml-4">
                <Text strong className="!text-white">Alexander Chen</Text>
                <div className="flex items-center">
                  <div className="w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
                  <Text className="text-xs text-blue-300">Online • Super Admin</Text>
                </div>
              </div>
            )}
          </div>
        </div>
      </Sider>

      {/* Main Content Area */}
      <Layout 
        className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-80'}`}
        style={{ minHeight: '100vh' }}
      >
        <Header className={`!p-0 !h-16 shadow-md ${isDarkMode ? '!bg-gray-800' : '!bg-white'}`}>
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className={`mr-4 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
              />
              <Divider type="vertical" className="h-6" />
              <Text className={`ml-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Welcome back, <strong>Alexander</strong>
              </Text>
            </div>
            
            <Space size="large">
              {/* Theme Toggle */}
              <div className="flex items-center">
                <Text className={`mr-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {isDarkMode ? 'Dark' : 'Light'}
                </Text>
                <Switch
                  checked={isDarkMode}
                  onChange={setIsDarkMode}
                  checkedChildren="🌙"
                  unCheckedChildren="☀️"
                />
              </div>
              
              {/* Notifications */}
              <Dropdown overlay={notificationsMenu} trigger={['click']}>
                <Badge count={5} size="small" offset={[-2, 2]}>
                  <Button 
                    type="text" 
                    icon={<BellOutlined />}
                    shape="circle"
                    className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}
                  />
                </Badge>
              </Dropdown>
              
              {/* Messages */}
              <Badge count={3} size="small" offset={[-2, 2]}>
                <Button 
                  type="text" 
                  icon={<MessageOutlined />}
                  shape="circle"
                  className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}
                />
              </Badge>
              
              {/* User Menu */}
              <Dropdown overlay={userMenu} trigger={['click']}>
                <div className="flex items-center cursor-pointer">
                  <Avatar 
                    size={36} 
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    className="border-2 border-cyan-400"
                  />
                  {!collapsed && (
                    <div className="ml-3">
                      <Text strong className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>
                        Alexander Chen
                      </Text>
                      <Text className={`block text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Super Admin
                      </Text>
                    </div>
                  )}
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>

        <Content className="p-6 overflow-auto">
          <Routes>
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<EnhancedDashboardPage isDarkMode={isDarkMode} />} />
            
            {/* Product Routes */}
            <Route path="/products" element={<AdminProductsPage />} />
            <Route path="/products/add" element={<AddProductForm />} />
            <Route path="/products/edit/:productId" element={<EditProductForm />} />
            
            {/* Order Routes */}
            <Route path="/orders" element={<EnhancedOrdersPage isDarkMode={isDarkMode} />} />
            
            {/* Customer Routes */}
            <Route path="/customers" element={<AdminUsersPage />} />
            
            {/* Admin Routes */}
            <Route path="/admins" element={<AdminAdminstratorPage />} />
            <Route path="/admins/add" element={<AddUserForm />} />
            
            {/* Review Routes */}
            <Route path="/reviews" element={<AdminReviewPage />} />
            
            {/* Default Route */}
            <Route path="/" element={<EnhancedDefaultPage isDarkMode={isDarkMode} />} />
          </Routes>
        </Content>
      </Layout>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        open={logoutModalVisible}
        onOk={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
        okText="Logout"
        cancelText="Cancel"
        okButtonProps={{ 
          danger: true,
          icon: <LogoutOutlined />
        }}
      >
        <div className="py-4 text-center">
          <Avatar size={64} src="https://randomuser.me/api/portraits/men/32.jpg" className="mb-4" />
          <Title level={4}>Are you sure you want to logout?</Title>
          <Text type="secondary">You will be redirected to the login page.</Text>
        </div>
      </Modal>

      {/* Floating Action Button */}
      <FloatButton.Group
        shape="circle"
        style={{ right: 24 }}
        icon={<SettingOutlined />}
      >
        <FloatButton 
          icon={<GlobalOutlined />} 
          tooltip="View Site"
          onClick={() => window.open('/', '_blank')}
        />
        <FloatButton 
          icon={<FileTextOutlined />} 
          tooltip="Documentation"
        />
        <FloatButton 
          icon={<DatabaseOutlined />} 
          tooltip="Backup"
        />
      </FloatButton.Group>
    </Layout>
  );
}

// Enhanced Dashboard Page Component
function EnhancedDashboardPage({ isDarkMode }) {
  const recentOrders = [
    { id: '#ORD-001', customer: 'John Smith', amount: '$245.99', status: 'completed', date: '2024-01-24' },
    { id: '#ORD-002', customer: 'Sarah Johnson', amount: '$129.50', status: 'pending', date: '2024-01-24' },
    { id: '#ORD-003', customer: 'Mike Wilson', amount: '$89.99', status: 'processing', date: '2024-01-23' },
    { id: '#ORD-004', customer: 'Emily Davis', amount: '$320.00', status: 'completed', date: '2024-01-23' },
    { id: '#ORD-005', customer: 'Robert Brown', amount: '$65.50', status: 'cancelled', date: '2024-01-22' },
  ];

  const topProducts = [
    { name: 'Sacred Oud Perfume', sales: 245, revenue: '$45,230', growth: '+12%' },
    { name: 'Golden Saffron Serum', sales: 189, revenue: '$27,405', growth: '+8%' },
    { name: '24K Gold Illuminator', sales: 156, revenue: '$19,500', growth: '+15%' },
    { name: 'Maroccan Argan Cream', sales: 132, revenue: '$12,936', growth: '+5%' },
    { name: 'Rose Otto Face Oil', sales: 98, revenue: '$16,170', growth: '+22%' },
  ];

  const timelineData = [
    { time: '09:30', action: 'New order received', color: 'green' },
    { time: '11:00', action: 'Product stock updated', color: 'blue' },
    { time: '14:15', action: 'Customer review posted', color: 'orange' },
    { time: '16:45', action: 'System maintenance', color: 'red' },
  ];

  const statsData = [
    { title: 'Total Revenue', value: 12450, prefix: '$', growth: '+12.5%', color: '#10b981', icon: <DollarOutlined /> },
    { title: 'Total Orders', value: 156, growth: '+8.2%', color: '#3b82f6', icon: <ShoppingCartOutlined /> },
    { title: 'Total Customers', value: 1248, growth: '+15.3%', color: '#8b5cf6', icon: <UserOutlined /> },
    { title: 'Conversion Rate', value: 4.2, suffix: '%', growth: '+2.1%', color: '#f59e0b', icon: <PieChartOutlined /> },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
        <Row align="middle">
          <Col xs={24} md={16}>
            <Title level={3} className={isDarkMode ? '!text-white' : '!text-gray-800'}>
              Welcome back, Alexander! 👋
            </Title>
            <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Here's what's happening with your store today. You have 12 new orders, 3 new reviews, and 5 new customers.
            </Text>
          </Col>
          <Col xs={24} md={8} className="text-right">
            <Button type="primary" size="large" className="border-0 bg-gradient-to-r from-blue-500 to-purple-500">
              View Reports
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Stats Grid */}
      <Row gutter={[20, 20]}>
        {statsData.map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Card 
              className={`shadow-lg border-0 hover:shadow-xl transition-all duration-300 ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{stat.title}</Text>
                  <Title level={2} className={`!mt-2 !mb-1 ${isDarkMode ? '!text-white' : ''}`}>
                    {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                  </Title>
                  <div className="flex items-center">
                    <RiseOutlined className="mr-1 text-green-500" />
                    <Text strong className="text-green-500">{stat.growth}</Text>
                    <Text className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>from last month</Text>
                  </div>
                </div>
                <div 
                  className="flex items-center justify-center w-12 h-12 rounded-xl"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <div 
                    className="text-2xl"
                    style={{ color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts and Recent Orders */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <Card 
            title={<Title level={4} className={isDarkMode ? '!text-white' : ''}>Recent Orders</Title>}
            className={`shadow-lg border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            extra={
              <Button type="link" className={isDarkMode ? 'text-blue-300' : 'text-blue-500'}>
                View All
              </Button>
            }
          >
            <Table
              size="middle"
              columns={[
                { 
                  title: 'Order ID', 
                  dataIndex: 'id', 
                  key: 'id',
                  render: (text) => <Text strong className={isDarkMode ? 'text-gray-300' : ''}>{text}</Text>
                },
                { 
                  title: 'Customer', 
                  dataIndex: 'customer', 
                  key: 'customer',
                  render: (text) => <Text className={isDarkMode ? 'text-gray-300' : ''}>{text}</Text>
                },
                { 
                  title: 'Amount', 
                  dataIndex: 'amount', 
                  key: 'amount',
                  render: (text) => <Text strong className="text-green-600">{text}</Text>
                },
                { 
                  title: 'Status', 
                  dataIndex: 'status', 
                  key: 'status',
                  render: (status) => {
                    const statusConfig = {
                      completed: { color: 'green', label: 'Completed' },
                      pending: { color: 'orange', label: 'Pending' },
                      processing: { color: 'blue', label: 'Processing' },
                      cancelled: { color: 'red', label: 'Cancelled' },
                    };
                    const config = statusConfig[status] || { color: 'default', label: status };
                    return (
                      <Tag 
                        color={config.color}
                        className="px-3 py-1 rounded-full"
                      >
                        {config.label}
                      </Tag>
                    );
                  }
                },
                { 
                  title: 'Date', 
                  dataIndex: 'date', 
                  key: 'date',
                  render: (text) => <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{text}</Text>
                },
              ]}
              dataSource={recentOrders}
              pagination={false}
              className={isDarkMode ? '!bg-gray-800' : ''}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title={<Title level={4} className={isDarkMode ? '!text-white' : ''}>Top Products</Title>}
            className={`shadow-lg border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <List
              dataSource={topProducts}
              renderItem={(item, index) => (
                <List.Item className={isDarkMode ? '!border-gray-700' : ''}>
                  <List.Item.Meta
                    avatar={
                      <div className="relative">
                        <Avatar 
                          size={40} 
                          className="bg-gradient-to-r from-blue-500 to-purple-500"
                        >
                          {index + 1}
                        </Avatar>
                        <div className="absolute flex items-center justify-center w-5 h-5 bg-green-500 rounded-full -top-1 -right-1">
                          <Text strong className="text-xs text-white">{item.growth}</Text>
                        </div>
                      </div>
                    }
                    title={
                      <Text strong className={isDarkMode ? 'text-gray-300' : ''}>
                        {item.name}
                      </Text>
                    }
                    description={
                      <div className="flex justify-between">
                        <div>
                          <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {item.sales} sales
                          </Text>
                        </div>
                        <Text strong className="text-green-500">
                          {item.revenue}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Activity Timeline and Quick Stats */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card 
            title={<Title level={4} className={isDarkMode ? '!text-white' : ''}>Recent Activity</Title>}
            className={`shadow-lg border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <Timeline
              items={timelineData.map((item, index) => ({
                key: index,
                color: item.color,
                children: (
                  <div>
                    <Text strong className={isDarkMode ? 'text-gray-300' : ''}>
                      {item.action}
                    </Text>
                    <Text className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.time} AM
                    </Text>
                  </div>
                )
              }))}
              className={isDarkMode ? '!text-gray-300' : ''}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title={<Title level={4} className={isDarkMode ? '!text-white' : ''}>Quick Stats</Title>}
            className={`shadow-lg border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className={`text-center p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <div className="text-3xl font-bold text-blue-500">24</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending Orders</div>
                </div>
              </Col>
              <Col span={12}>
                <div className={`text-center p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className="text-3xl font-bold text-green-500">156</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Products in Stock</div>
                </div>
              </Col>
              <Col span={12}>
                <div className={`text-center p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                  <div className="text-3xl font-bold text-orange-500">8.9</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg. Rating</div>
                </div>
              </Col>
              <Col span={12}>
                <div className={`text-center p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <div className="text-3xl font-bold text-purple-500">89%</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Satisfaction</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card 
        title={<Title level={4} className={isDarkMode ? '!text-white' : ''}>Quick Actions</Title>}
        className={`shadow-lg border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <Row gutter={[16, 16]}>
          {[
            { icon: <UserAddOutlined />, label: 'Add Product', color: 'blue', to: '/admin/products/add' },
            { icon: <AppstoreOutlined />, label: 'Manage Products', color: 'green', to: '/admin/products' },
            { icon: <TagOutlined />, label: 'Create Coupon', color: 'orange', to: '/admin/coupons' },
            { icon: <WalletOutlined />, label: 'View Revenue', color: 'purple', to: '/admin/analytics' },
            { icon: <StarOutlined />, label: 'Check Reviews', color: 'cyan', to: '/admin/reviews' },
            { icon: <TeamOutlined />, label: 'Add Admin', color: 'pink', to: '/admin/admins/add' },
          ].map((action, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={4}>
              <Tooltip title={action.label}>
                <Link to={action.to}>
                  <Card 
                    hoverable 
                    className={`text-center border-2 border-dashed hover:scale-105 transition-transform ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-blue-400' 
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    <div 
                      className={`text-3xl mb-3`}
                      style={{ color: action.color }}
                    >
                      {action.icon}
                    </div>
                    <Text strong className={isDarkMode ? 'text-gray-300' : ''}>
                      {action.label}
                    </Text>
                  </Card>
                </Link>
              </Tooltip>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}

// Enhanced Orders Page Component
function EnhancedOrdersPage({ isDarkMode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className={isDarkMode ? '!text-white' : ''}>Orders Management</Title>
          <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Manage and track customer orders efficiently
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<ShoppingCartOutlined />}
          className="border-0 bg-gradient-to-r from-blue-500 to-purple-500"
          size="large"
        >
          New Order
        </Button>
      </div>
      
      <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="py-12 text-center">
          <ShoppingCartOutlined className="mb-4 text-5xl text-gray-400" />
          <Title level={4} className={isDarkMode ? '!text-gray-300' : ''}>
            Orders Management Page
          </Title>
          <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            This page will contain order management features
          </Text>
        </div>
      </Card>
    </div>
  );
}

// Enhanced Default Admin Page Component
function EnhancedDefaultPage({ isDarkMode }) {
  return (
    <div className="space-y-6">
      <div className="py-12 text-center">
        <div className="flex items-center justify-center w-32 h-32 mx-auto mb-8 rounded-full shadow-2xl bg-gradient-to-r from-blue-500 to-purple-500">
          <SafetyCertificateOutlined className="text-6xl text-white" />
        </div>
        <Title level={2} className={`mb-4 ${isDarkMode ? '!text-white' : ''}`}>
          Welcome to ELEVÉ Admin Panel
        </Title>
        <Text className={`text-lg max-w-2xl mx-auto mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Premium dashboard for managing your beauty and cosmetics store.
          Track sales, manage products, handle orders, and monitor customer activity in real-time.
        </Text>
        
        <Row gutter={[24, 24]} justify="center">
          {[
            { icon: <ShoppingOutlined />, title: 'Products', desc: 'Manage product catalog and inventory', color: 'blue' },
            { icon: <ShoppingCartOutlined />, title: 'Orders', desc: 'Process and track customer orders', color: 'green' },
            { icon: <UserOutlined />, title: 'Customers', desc: 'Manage accounts and purchase history', color: 'purple' },
            { icon: <BarChartOutlined />, title: 'Analytics', desc: 'View sales and performance metrics', color: 'orange' },
          ].map((item, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                className={`text-center h-full border-0 shadow-lg ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'
                }`}
              >
                <div 
                  className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div className="text-3xl" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                </div>
                <Title level={4} className={isDarkMode ? '!text-white' : ''}>
                  {item.title}
                </Title>
                <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {item.desc}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}