// src/pages/admin/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Typography,
  Space,
  message,
  Divider,
  Row,
  Col,
  Tabs,
  Alert
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CameraOutlined,
  SaveOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

const ProfilePage = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get('/api/users/me');
      if (response.data.success) {
        setUserData(response.data.user);
        profileForm.setFieldsValue({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Failed to load user data');
    }
  };

  const handleProfileUpdate = async (values) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put('/api/users/profile', values);
      if (response.data.success) {
        message.success('Profile updated successfully');
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        fetchUserData();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put('/api/users/password', values);
      if (response.data.success) {
        message.success('Password changed successfully');
        passwordForm.resetFields();
      }
    } catch (error) {
      console.error('Error changing password:', error);
      message.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicUpload = async (file) => {
    try {
      setUploading(true);
      // In a real app, you would upload to a file storage service
      // For now, we'll use a mock URL
      const mockImageUrl = `https://ui-avatars.com/api/?name=${userData?.firstName}+${userData?.lastName}&background=08979c&color=fff`;
      
      const response = await axiosInstance.put('/api/users/profile-picture', {
        profilePic: mockImageUrl
      });
      
      if (response.data.success) {
        message.success('Profile picture updated successfully');
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        fetchUserData();
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      message.error('Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Title level={2} className="!text-teal-800">My Profile</Title>
      
      <Row gutter={[24, 24]}>
        {/* Profile Picture Section */}
        <Col xs={24} md={8}>
          <Card className="text-center">
            <div className="relative inline-block mb-4">
              <Avatar
                size={128}
                src={userData?.profilePic}
                icon={!userData?.profilePic && <UserOutlined />}
                className="border-4 border-teal-100"
              >
                {!userData?.profilePic && userData && `${userData.firstName?.[0]}${userData.lastName?.[0]}`}
              </Avatar>
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  handleProfilePicUpload(file);
                  return false;
                }}
              >
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CameraOutlined />}
                  className="absolute bg-teal-600 border-0 bottom-2 right-2 hover:bg-teal-700"
                  loading={uploading}
                />
              </Upload>
            </div>
            <Title level={4} className="!mb-1 !text-teal-800">
              {userData?.firstName} {userData?.lastName}
            </Title>
            <Text className="text-teal-600">{userData?.email}</Text>
            <Divider />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Text className="text-gray-600">Account Type:</Text>
                <Text strong className="text-teal-700">
                  {userData?.type === 'admin' ? 'Administrator' : 'User'}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-600">Member Since:</Text>
                <Text className="text-teal-600">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Profile & Password Section */}
        <Col xs={24} md={16}>
          <Tabs defaultActiveKey="profile">
            <TabPane tab="Profile Information" key="profile">
              <Card>
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileUpdate}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[
                          { required: true, message: 'Please enter your first name' },
                          { min: 2, message: 'First name must be at least 2 characters' }
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined className="text-teal-500" />}
                          placeholder="First Name"
                          className="border-teal-200"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[
                          { required: true, message: 'Please enter your last name' },
                          { min: 2, message: 'Last name must be at least 2 characters' }
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined className="text-teal-500" />}
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
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-teal-500" />}
                      placeholder="Email Address"
                      className="border-teal-200"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                      className="bg-teal-600 border-0 hover:bg-teal-700"
                    >
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </TabPane>

            <TabPane tab="Change Password" key="password">
              <Card>
                <Alert
                  message="Password Requirements"
                  description="Password must be at least 6 characters long and contain at least one letter and one number."
                  type="info"
                  showIcon
                  className="mb-6"
                />

                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handlePasswordChange}
                >
                  <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[{ required: true, message: 'Please enter current password' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-teal-500" />}
                      placeholder="Current Password"
                      className="border-teal-200"
                    />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                      { required: true, message: 'Please enter new password' },
                      { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-teal-500" />}
                      placeholder="New Password"
                      className="border-teal-200"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Please confirm new password' },
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
                      prefix={<LockOutlined className="text-teal-500" />}
                      placeholder="Confirm New Password"
                      className="border-teal-200"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<CheckCircleOutlined />}
                      className="bg-teal-600 border-0 hover:bg-teal-700"
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;