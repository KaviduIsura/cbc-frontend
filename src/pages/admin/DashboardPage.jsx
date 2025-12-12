// src/pages/admin/DashboardPage.jsx
import React from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import StatsCards from '../../components/admin/dashboard/StatsCards';
import RecentOrders from '../../components/admin/dashboard/RecentOrders';
import QuickActions from '../../components/admin/dashboard/QuickActions';

const { Title, Text } = Typography;

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-teal-50 to-white">
        <Row align="middle">
          <Col xs={24} md={16}>
            <Title level={3} className="!text-teal-800">
              Welcome back, Alexander! 👋
            </Title>
            <Text className="text-teal-600">
              Here's what's happening with your store today. You have 12 new
              orders, 3 new reviews, and 5 new customers.
            </Text>
          </Col>
          <Col xs={24} md={8} className="text-right">
            <Button
              type="primary"
              size="large"
              className="border-0 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
            >
              View Reports
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Stats Grid */}
      <StatsCards />

      {/* Charts and Recent Orders */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <RecentOrders />
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={<Title level={4} className="!text-teal-800">Top Products</Title>}
            className="bg-white border-0 shadow-md"
          >
            {/* Add Top Products List here */}
            <div className="py-8 text-center text-teal-600">
              Top Products List
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default DashboardPage;