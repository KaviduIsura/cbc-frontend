// src/pages/admin/DefaultPage.jsx
import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const DefaultPage = () => {
  const features = [
    {
      icon: <ShoppingOutlined />,
      title: "Products",
      desc: "Manage product catalog and inventory",
      color: "#08979c",
    },
    {
      icon: <ShoppingCartOutlined />,
      title: "Orders",
      desc: "Process and track customer orders",
      color: "#13c2c2",
    },
    {
      icon: <UserOutlined />,
      title: "Customers",
      desc: "Manage accounts and purchase history",
      color: "#52c41a",
    },
    {
      icon: <BarChartOutlined />,
      title: "Analytics",
      desc: "View sales and performance metrics",
      color: "#fa8c16",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="py-12 text-center">
        <div className="flex items-center justify-center w-32 h-32 mx-auto mb-8 rounded-full shadow-xl bg-gradient-to-r from-teal-500 to-teal-600">
          <SafetyCertificateOutlined className="text-6xl text-white" />
        </div>
        <Title level={2} className="mb-4 !text-teal-800">
          Welcome to ELEVÉ Admin Panel
        </Title>
        <Text className="max-w-2xl mx-auto mb-8 text-lg text-teal-600">
          Premium dashboard for managing your beauty and cosmetics store. Track
          sales, manage products, handle orders, and monitor customer activity
          in real-time.
        </Text>

        <Row gutter={[24, 24]} justify="center">
          {features.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Card
                hoverable
                className="h-full text-center transition-all duration-300 bg-white border-0 shadow-md hover:shadow-lg"
              >
                <div
                  className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <div className="text-3xl" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                </div>
                <Title level={4} className="!text-teal-800">
                  {item.title}
                </Title>
                <Text className="text-teal-600">
                  {item.desc}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default DefaultPage;