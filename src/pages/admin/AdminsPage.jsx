// src/pages/admin/AdminsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Badge,
  Descriptions,
  Row,
  Col,
  Statistic,
  Tooltip,
  Dropdown,
  Avatar,
  Typography,
  Popconfirm,
  message,
  notification,
  Divider,
  Tabs,
  Progress,
  Spin,
  Switch,
  InputNumber,
  Radio,
  Checkbox,
  Alert
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  BlockOutlined,
  CheckOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  TeamOutlined,
  BarChartOutlined,
  FileExcelOutlined,
  SafetyOutlined,
  KeyOutlined,
  CrownOutlined,
  PlusOutlined,
  LockOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';

dayjs.extend(relativeTime);
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

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

// Available permissions
const PERMISSIONS = [
  { value: 'manage_products', label: 'Manage Products' },
  { value: 'manage_orders', label: 'Manage Orders' },
  { value: 'manage_customers', label: 'Manage Customers' },
  { value: 'manage_admins', label: 'Manage Admins' },
  { value: 'manage_reviews', label: 'Manage Reviews' },
  { value: 'view_analytics', label: 'View Analytics' },
  { value: 'manage_settings', label: 'Manage Settings' },
  { value: 'manage_promotions', label: 'Manage Promotions' },
  { value: 'manage_categories', label: 'Manage Categories' },
];

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    superAdmins: 0,
    newThisMonth: 0,
    growthPercentage: 0,
    activePercentage: 0
  });
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    dateRange: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [blockReason, setBlockReason] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();

  // Status configurations
  const statusConfig = {
    active: { 
      color: '#52c41a', 
      label: 'Active', 
      icon: <CheckCircleOutlined />,
    },
    blocked: { 
      color: '#ff4d4f', 
      label: 'Blocked', 
      icon: <BlockOutlined />,
    },
  };

  // Role configurations
  const roleConfig = {
    super: { 
      color: 'gold', 
      label: 'Super Admin', 
      icon: <CrownOutlined />,
    },
    regular: { 
      color: 'blue', 
      label: 'Admin', 
      icon: <SafetyOutlined />,
    },
  };

  // Fetch admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/admins', {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          search: searchText,
          status: filters.status,
        },
      });

      if (response.data.success) {
        const adminsData = response.data.admins || [];
        setAdmins(adminsData);
        setFilteredAdmins(adminsData);
        setPagination({
          ...pagination,
          total: response.data.pagination?.totalItems || adminsData.length,
        });
        
        // Update stats if available
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch admins');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      notification.error({
        message: 'Error Loading Admins',
        description: error.response?.data?.message || 'Failed to fetch admins',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin stats
  const fetchAdminStats = async () => {
    try {
      const response = await axiosInstance.get('/api/admins/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  // View admin details
  const viewAdminDetails = async (adminId) => {
    try {
      const response = await axiosInstance.get(`/api/admins/${adminId}`);
      
      if (response.data.success) {
        setSelectedAdmin(response.data.admin);
        setViewModalVisible(true);
      } else {
        throw new Error(response.data.message || 'Failed to fetch admin details');
      }
    } catch (error) {
      console.error('Error fetching admin details:', error);
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'Failed to fetch admin details',
      });
    }
  };

  // Create new admin
  const createAdmin = async (values) => {
    try {
      const response = await axiosInstance.post('/api/admins', values);

      if (response.data.success) {
        message.success('Admin created successfully');
        fetchAdmins();
        fetchAdminStats();
        setAddModalVisible(false);
        form.resetFields();
      } else {
        throw new Error(response.data.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      notification.error({
        message: 'Create Failed',
        description: error.response?.data?.message || 'Failed to create admin',
      });
    }
  };

  // Update admin
  const updateAdmin = async (values) => {
    try {
      if (!selectedAdmin) return;

      const response = await axiosInstance.put(`/api/admins/${selectedAdmin._id}`, values);

      if (response.data.success) {
        message.success('Admin updated successfully');
        fetchAdmins();
        fetchAdminStats();
        setEditModalVisible(false);
        editForm.resetFields();
      } else {
        throw new Error(response.data.message || 'Failed to update admin');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      notification.error({
        message: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update admin',
      });
    }
  };

  // Update admin status (block/unblock)
  const updateAdminStatus = async (adminId, isBlocked) => {
    try {
      const response = await axiosInstance.put(`/api/admins/${adminId}/status`, {
        isBlocked,
        reason: blockReason
      });

      if (response.data.success) {
        message.success(`Admin ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
        fetchAdmins();
        fetchAdminStats();
        setBlockModalVisible(false);
        setBlockReason('');
      } else {
        throw new Error(response.data.message || 'Failed to update admin status');
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
      notification.error({
        message: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update admin status',
      });
    }
  };

  // Reset admin password
  const resetAdminPassword = async (values) => {
    try {
      if (!selectedAdmin) return;

      const response = await axiosInstance.put(`/api/admins/${selectedAdmin._id}/reset-password`, {
        newPassword: values.newPassword
      });

      if (response.data.success) {
        message.success('Admin password reset successfully');
        setResetPasswordModalVisible(false);
        resetPasswordForm.resetFields();
      } else {
        throw new Error(response.data.message || 'Failed to reset admin password');
      }
    } catch (error) {
      console.error('Error resetting admin password:', error);
      notification.error({
        message: 'Reset Failed',
        description: error.response?.data?.message || 'Failed to reset admin password',
      });
    }
  };

  // Delete admin
  const deleteAdmin = async (adminId) => {
    try {
      const response = await axiosInstance.delete(`/api/admins/${adminId}`);

      if (response.data.success) {
        message.success('Admin deleted successfully');
        fetchAdmins();
        fetchAdminStats();
      } else {
        throw new Error(response.data.message || 'Failed to delete admin');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      notification.error({
        message: 'Delete Failed',
        description: error.response?.data?.message || 'Failed to delete admin',
      });
    }
  };

  // Export admins to Excel/CSV
  const exportAdmins = async () => {
    setExportLoading(true);
    try {
      const response = await axiosInstance.get('/api/admins', {
        params: {
          limit: 1000, // Get all admins
          search: searchText,
          status: filters.status,
        },
      });

      if (response.data.success) {
        const adminsData = response.data.admins || [];
        
        // Convert to CSV format
        const headers = ['Name', 'Email', 'Role', 'Status', 'Permissions', 'Created Date', 'Last Login'];
        const csvData = adminsData.map(admin => [
          `${admin.firstName} ${admin.lastName}`,
          admin.email,
          admin.isSuperAdmin ? 'Super Admin' : 'Admin',
          admin.isBlocked ? 'Blocked' : 'Active',
          admin.permissions?.join('; ') || 'None',
          dayjs(admin.createdAt).format('YYYY-MM-DD'),
          admin.lastLogin ? dayjs(admin.lastLogin).format('YYYY-MM-DD') : 'Never'
        ]);

        const csvContent = [
          headers.join(','),
          ...csvData.map(row => row.join(','))
        ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `admins_${dayjs().format('YYYY-MM-DD')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        message.success('Admins exported successfully');
      }
    } catch (error) {
      console.error('Error exporting admins:', error);
      notification.error({
        message: 'Export Failed',
        description: 'Failed to export admins',
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Admin',
      key: 'admin',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar
            src={record.profilePic}
            icon={<UserOutlined />}
            className="mr-3 border border-teal-100"
            size="large"
          >
            {record.firstName?.[0]}{record.lastName?.[0]}
          </Avatar>
          <div>
            <div className="font-medium text-teal-800">
              {record.firstName} {record.lastName}
              {record.isSuperAdmin && (
                <CrownOutlined className="ml-2 text-yellow-500" />
              )}
            </div>
            <div className="text-sm text-teal-600">
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      key: 'role',
      width: 120,
      render: (_, record) => {
        const role = record.isSuperAdmin ? 'super' : 'regular';
        const config = roleConfig[role];
        return (
          <Tag 
            color={config.color} 
            className="px-2 py-1 text-xs capitalize"
            icon={config.icon}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const status = record.isBlocked ? 'blocked' : 'active';
        const config = statusConfig[status];
        return (
          <Tag 
            color={config.color} 
            className="px-2 py-1 text-xs capitalize"
            icon={config.icon}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: 'Permissions',
      key: 'permissions',
      width: 150,
      render: (_, record) => (
        <div>
          {record.permissions?.length > 0 ? (
            <Text className="text-xs text-teal-600">
              {record.permissions.length} permission(s)
            </Text>
          ) : (
            <Tag color="default" className="text-xs">No permissions</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Join Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (
        <div>
          <div className="text-teal-800">{dayjs(date).format('MMM D, YYYY')}</div>
          <div className="text-xs text-teal-500">{dayjs(date).fromNow()}</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => viewAdminDetails(record._id)}
              className="text-teal-600 hover:text-teal-700"
              size="small"
            />
          </Tooltip>
          
          <Tooltip title={record.isBlocked ? "Unblock Admin" : "Block Admin"}>
            <Button
              type="text"
              icon={record.isBlocked ? <CheckOutlined /> : <BlockOutlined />}
              onClick={() => {
                setSelectedAdmin(record);
                setBlockModalVisible(true);
              }}
              className={record.isBlocked ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"}
              size="small"
            />
          </Tooltip>

          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Edit Admin',
                  icon: <EditOutlined />,
                  onClick: () => {
                    setSelectedAdmin(record);
                    editForm.setFieldsValue({
                      firstName: record.firstName,
                      lastName: record.lastName,
                      email: record.email,
                      isSuperAdmin: record.isSuperAdmin,
                      permissions: record.permissions || [],
                    });
                    setEditModalVisible(true);
                  },
                },
                {
                  key: 'resetPassword',
                  label: 'Reset Password',
                  icon: <KeyOutlined />,
                  onClick: () => {
                    setSelectedAdmin(record);
                    setResetPasswordModalVisible(true);
                  },
                },
                {
                  type: 'divider',
                },
                {
                  key: 'delete',
                  label: 'Delete Admin',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => {
                    Modal.confirm({
                      title: 'Delete Admin',
                      content: `Are you sure you want to delete ${record.firstName} ${record.lastName}? This action cannot be undone.`,
                      okText: 'Delete',
                      cancelText: 'Cancel',
                      okButtonProps: { danger: true },
                      onOk: () => deleteAdmin(record._id),
                    });
                  },
                },
              ],
            }}
            trigger={['click']}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              className="text-gray-600 hover:text-gray-700"
              size="small"
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Apply filters
  const applyFilters = () => {
    let filtered = [...admins];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(admin =>
        admin.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
        admin.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(admin => 
        filters.status === 'active' ? !admin.isBlocked : admin.isBlocked
      );
    }

    // Role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(admin => 
        filters.role === 'super' ? admin.isSuperAdmin : !admin.isSuperAdmin
      );
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter(admin =>
        dayjs(admin.createdAt).isBetween(start, end, 'day', '[]')
      );
    }

    setFilteredAdmins(filtered);
  };

  // Handle table change
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchAdmins();
  };

  // Initial fetch
  useEffect(() => {
    fetchAdmins();
    fetchAdminStats();
  }, [pagination.current, pagination.pageSize]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, searchText, admins]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Title level={2} className="!text-teal-800">
            Admin Management
          </Title>
          <Text className="text-teal-600">
            Manage administrative accounts and permissions
          </Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              fetchAdmins();
              fetchAdminStats();
            }}
            loading={loading}
            className="text-teal-600 border-teal-200 hover:text-teal-700 hover:border-teal-300"
          >
            Refresh
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={exportAdmins}
            loading={exportLoading}
            className="text-teal-600 border-teal-200 hover:text-teal-700 hover:border-teal-300"
          >
            Export
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
            className="bg-teal-600 border-0 hover:bg-teal-700"
          >
            Add New Admin
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="transition-shadow bg-white border-0 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-teal-800">
                  {stats.total}
                </div>
                <div className="text-sm text-teal-600">
                  Total Admins
                </div>
                <div className="mt-1 text-xs text-teal-500">
                  All administrative accounts
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50">
                <TeamOutlined className="text-xl text-teal-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="transition-shadow bg-white border-0 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.active}
                </div>
                <div className="text-sm text-teal-600">
                  Active Admins
                </div>
                <div className="mt-1 text-xs text-teal-500">
                  {stats.activePercentage}% of total
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-50">
                <CheckCircleOutlined className="text-xl text-green-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="transition-shadow bg-white border-0 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gold-600">
                  {stats.superAdmins}
                </div>
                <div className="text-sm text-teal-600">
                  Super Admins
                </div>
                <div className="mt-1 text-xs text-teal-500">
                  Full access accounts
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-50">
                <CrownOutlined className="text-xl text-yellow-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="transition-shadow bg-white border-0 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-teal-800">
                  {stats.newThisMonth}
                </div>
                <div className="text-sm text-teal-600">
                  New This Month
                </div>
                <div className="mt-1 text-xs text-teal-500">
                  {stats.growthPercentage}% growth
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50">
                <BarChartOutlined className="text-xl text-blue-600" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters Card */}
      <Card
        className="bg-white border-0 shadow-sm"
        title={
          <div className="flex items-center">
            <FilterOutlined className="mr-2 text-teal-600" />
            <span className="text-teal-800">Filters</span>
          </div>
        }
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search by name or email..."
              prefix={<SearchOutlined className="text-teal-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border-teal-200 hover:border-teal-300 focus:border-teal-500"
              allowClear
            />
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder="Status"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              className="border-teal-200 hover:border-teal-300"
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active Only</Option>
              <Option value="blocked">Blocked Only</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder="Role"
              style={{ width: '100%' }}
              value={filters.role}
              onChange={(value) => setFilters({ ...filters, role: value })}
              className="border-teal-200 hover:border-teal-300"
            >
              <Option value="all">All Roles</Option>
              <Option value="super">Super Admins</Option>
              <Option value="regular">Regular Admins</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              className="border-teal-200 hover:border-teal-300"
              placeholder={['Join Date From', 'Join Date To']}
            />
          </Col>
          <Col xs={24} md={4}>
            <Button
              block
              onClick={() => {
                setSearchText('');
                setFilters({
                  status: 'all',
                  role: 'all',
                  dateRange: null,
                });
              }}
              className="text-teal-600 border-teal-200 hover:text-teal-700 hover:border-teal-300"
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Admins Table */}
      <Card
        className="bg-white border-0 shadow-sm"
        title={
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <Title level={4} className="!mb-0 !text-teal-800">
                All Administrators
              </Title>
              <Text className="text-teal-600">
                {filteredAdmins.length} admins found • {stats.active} active • {stats.superAdmins} super admins
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Text className="text-teal-600">
                Showing {((pagination.current - 1) * pagination.pageSize) + 1}-
                {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total}
              </Text>
              <Progress
                percent={Math.round((filteredAdmins.length / (pagination.total || 1)) * 100)}
                size="small"
                strokeColor="#08979c"
                showInfo={false}
                style={{ width: 100 }}
              />
            </div>
          </div>
        }
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredAdmins}
            rowKey="_id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => (
                <Text className="text-teal-600">
                  {range[0]}-{range[1]} of {total} admins
                </Text>
              ),
            }}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
            rowClassName="hover:bg-teal-50 transition-colors"
          />
        </Spin>
      </Card>

      {/* Add Admin Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <PlusOutlined className="mr-2 text-teal-600" />
            <span className="text-teal-800">Add New Admin</span>
          </div>
        }
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Create Admin"
        okButtonProps={{
          className: 'bg-teal-600 hover:bg-teal-700 border-0',
        }}
        cancelButtonProps={{
          className: 'border-teal-200 text-teal-600 hover:text-teal-700',
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={createAdmin}
          className="mt-6"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input
                  placeholder="First Name"
                  className="border-teal-200"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input
                  placeholder="Last Name"
                  className="border-teal-200"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              placeholder="Email Address"
              className="border-teal-200"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password
              placeholder="Password"
              className="border-teal-200"
            />
          </Form.Item>

          <Form.Item
            name="isSuperAdmin"
            label="Admin Type"
            valuePropName="checked"
          >
            <Checkbox>Super Admin (Full access to all features)</Checkbox>
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permissions"
            help="Select specific permissions for this admin"
          >
            <Checkbox.Group className="grid grid-cols-2 gap-2">
              {PERMISSIONS.map(permission => (
                <Checkbox key={permission.value} value={permission.value}>
                  {permission.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="mr-2 text-teal-600" />
            <span className="text-teal-800">Edit Admin</span>
          </div>
        }
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        onOk={() => editForm.submit()}
        okText="Update Admin"
        okButtonProps={{
          className: 'bg-teal-600 hover:bg-teal-700 border-0',
        }}
        cancelButtonProps={{
          className: 'border-teal-200 text-teal-600 hover:text-teal-700',
        }}
        width={600}
      >
        {selectedAdmin && (
          <Form
            form={editForm}
            layout="vertical"
            onFinish={updateAdmin}
            className="mt-6"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true, message: 'Please enter first name' }]}
                >
                  <Input
                    placeholder="First Name"
                    className="border-teal-200"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true, message: 'Please enter last name' }]}
                >
                  <Input
                    placeholder="Last Name"
                    className="border-teal-200"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input
                placeholder="Email Address"
                className="border-teal-200"
              />
            </Form.Item>

            {selectedAdmin._id !== JSON.parse(localStorage.getItem('user'))._id && (
              <Form.Item
                name="isSuperAdmin"
                label="Admin Type"
                valuePropName="checked"
              >
                <Checkbox>Super Admin (Full access to all features)</Checkbox>
              </Form.Item>
            )}

            {!selectedAdmin.isSuperAdmin && (
              <Form.Item
                name="permissions"
                label="Permissions"
                help="Select specific permissions for this admin"
              >
                <Checkbox.Group className="grid grid-cols-2 gap-2">
                  {PERMISSIONS.map(permission => (
                    <Checkbox key={permission.value} value={permission.value}>
                      {permission.label}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            )}
          </Form>
        )}
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <KeyOutlined className="mr-2 text-teal-600" />
            <span className="text-teal-800">Reset Admin Password</span>
          </div>
        }
        open={resetPasswordModalVisible}
        onCancel={() => {
          setResetPasswordModalVisible(false);
          resetPasswordForm.resetFields();
        }}
        onOk={() => resetPasswordForm.submit()}
        okText="Reset Password"
        okButtonProps={{
          className: 'bg-teal-600 hover:bg-teal-700 border-0',
        }}
        cancelButtonProps={{
          className: 'border-teal-200 text-teal-600 hover:text-teal-700',
        }}
        width={500}
      >
        {selectedAdmin && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-teal-50">
              <div className="flex items-center space-x-3">
                <Avatar
                  size={48}
                  src={selectedAdmin.profilePic}
                  icon={<UserOutlined />}
                  className="border-2 border-teal-200"
                >
                  {selectedAdmin.firstName?.[0]}{selectedAdmin.lastName?.[0]}
                </Avatar>
                <div>
                  <Text strong className="text-teal-800">
                    {selectedAdmin.firstName} {selectedAdmin.lastName}
                  </Text>
                  <div className="text-sm text-teal-600">{selectedAdmin.email}</div>
                </div>
              </div>
            </div>

            <Alert
              message="Password Reset"
              description="This will reset the admin's password. They will need to use this new password to login."
              type="warning"
              showIcon
            />

            <Form
              form={resetPasswordForm}
              layout="vertical"
              onFinish={resetAdminPassword}
              className="mt-4"
            >
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter new password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password
                  placeholder="Enter new password"
                  className="border-teal-200"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm new password"
                  className="border-teal-200"
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Block/Unblock Modal */}
      <Modal
        title={
          <div className="flex items-center">
            {selectedAdmin?.isBlocked ? (
              <>
                <CheckOutlined className="mr-2 text-green-600" />
                <span className="text-teal-800">Unblock Admin</span>
              </>
            ) : (
              <>
                <BlockOutlined className="mr-2 text-red-600" />
                <span className="text-teal-800">Block Admin</span>
              </>
            )}
          </div>
        }
        open={blockModalVisible}
        onCancel={() => {
          setBlockModalVisible(false);
          setBlockReason('');
        }}
        onOk={() => {
          if (selectedAdmin) {
            updateAdminStatus(selectedAdmin._id, !selectedAdmin.isBlocked);
          }
        }}
        okText={selectedAdmin?.isBlocked ? "Unblock Admin" : "Block Admin"}
        okButtonProps={{
          danger: !selectedAdmin?.isBlocked,
          type: 'primary',
          className: selectedAdmin?.isBlocked ? 'bg-green-600 hover:bg-green-700' : '',
        }}
        cancelButtonProps={{
          className: 'border-teal-200 text-teal-600 hover:text-teal-700',
        }}
        width={500}
      >
        {selectedAdmin && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-teal-50">
              <div className="flex items-center space-x-3">
                <Avatar
                  size={48}
                  src={selectedAdmin.profilePic}
                  icon={<UserOutlined />}
                  className="border-2 border-teal-200"
                >
                  {selectedAdmin.firstName?.[0]}{selectedAdmin.lastName?.[0]}
                </Avatar>
                <div>
                  <Text strong className="text-teal-800">
                    {selectedAdmin.firstName} {selectedAdmin.lastName}
                  </Text>
                  <div className="text-sm text-teal-600">{selectedAdmin.email}</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-yellow-50">
              <div className="flex items-start">
                <ExclamationCircleOutlined className="mt-1 mr-2 text-yellow-600" />
                <div>
                  <Text strong className="text-yellow-700">
                    {selectedAdmin.isBlocked ? "Unblocking this admin will:" : "Blocking this admin will:"}
                  </Text>
                  <ul className="mt-1 ml-4 text-sm text-yellow-600 list-disc">
                    {selectedAdmin.isBlocked ? (
                      <>
                        <li>Allow them to login to the admin panel</li>
                        <li>Restore their permissions and access</li>
                        <li>Enable their account immediately</li>
                      </>
                    ) : (
                      <>
                        <li>Prevent them from logging into the admin panel</li>
                        <li>Block all administrative access</li>
                        <li>Keep their data in the system</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <Form layout="vertical">
              <Form.Item
                label={
                  <div className="flex items-center">
                    <span className="text-teal-700">
                      {selectedAdmin.isBlocked ? "Unblock Reason (Optional)" : "Block Reason"}
                    </span>
                    {!selectedAdmin.isBlocked && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </div>
                }
              >
                <Input.TextArea
                  rows={3}
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder={
                    selectedAdmin.isBlocked
                      ? "Optional: Enter reason for unblocking..."
                      : "Enter reason for blocking this admin..."
                  }
                  className="border-teal-200 hover:border-teal-300"
                  required={!selectedAdmin.isBlocked}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminsPage;