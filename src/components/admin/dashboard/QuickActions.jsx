// src/components/admin/dashboard/QuickActions.jsx
import React from 'react';
import { Card, Row, Col, Tooltip, Typography } from 'antd';
import { Link } from 'react-router-dom';
import {
  UserAddOutlined,
  AppstoreOutlined,
  TagOutlined,
  WalletOutlined,
  StarOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const QuickActions = () => {
  const actions = [
    {
      icon: <UserAddOutlined />,
      label: "Add Product",
      color: "#08979c",
      to: "/admin/products/add",
    },
    {
      icon: <AppstoreOutlined />,
      label: "Manage Products",
      color: "#13c2c2",
      to: "/admin/products",
    },
    {
      icon: <TagOutlined />,
      label: "Create Coupon",
      color: "#52c41a",
      to: "/admin/coupons",
    },
    {
      icon: <WalletOutlined />,
      label: "View Revenue",
      color: "#fa8c16",
      to: "/admin/analytics",
    },
    {
      icon: <StarOutlined />,
      label: "Check Reviews",
      color: "#722ed1",
      to: "/admin/reviews",
    },
    {
      icon: <TeamOutlined />,
      label: "Add Admin",
      color: "#eb2f96",
      to: "/admin/admins/add",
    },
  ];

  return (
    <Card
      title={<Text strong className="text-teal-800">Quick Actions</Text>}
      className="bg-white border-0 shadow-md"
    >
      <Row gutter={[16, 16]}>
        {actions.map((action, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={4}>
            <Tooltip title={action.label}>
              <Link to={action.to}>
                <Card
                  hoverable
                  className="text-center transition-all duration-300 bg-white border border-teal-200 hover:border-teal-400 hover:scale-105"
                  bodyStyle={{ padding: '16px' }}
                >
                  <div
                    className="mb-3 text-3xl"
                    style={{ color: action.color }}
                  >
                    {action.icon}
                  </div>
                  <Text strong className="text-teal-800">
                    {action.label}
                  </Text>
                </Card>
              </Link>
            </Tooltip>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default QuickActions;