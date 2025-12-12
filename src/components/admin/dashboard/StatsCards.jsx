// src/components/admin/dashboard/StatsCards.jsx
import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PieChartOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const StatsCards = () => {
  const statsData = [
    {
      title: "Total Revenue",
      value: 12450,
      prefix: "$",
      growth: "+12.5%",
      color: "#08979c",
      icon: <DollarOutlined />,
    },
    {
      title: "Total Orders",
      value: 156,
      growth: "+8.2%",
      color: "#13c2c2",
      icon: <ShoppingCartOutlined />,
    },
    {
      title: "Total Customers",
      value: 1248,
      growth: "+15.3%",
      color: "#52c41a",
      icon: <UserOutlined />,
    },
    {
      title: "Conversion Rate",
      value: 4.2,
      suffix: "%",
      growth: "+2.1%",
      color: "#fa8c16",
      icon: <PieChartOutlined />,
    },
  ];

  return (
    <Row gutter={[20, 20]}>
      {statsData.map((stat, index) => (
        <Col key={index} xs={24} sm={12} lg={6}>
          <Card
            className="transition-all duration-300 bg-white border-0 shadow-md hover:shadow-lg"
            bodyStyle={{ padding: '20px' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <Text className="text-teal-600">{stat.title}</Text>
                <Title level={2} className="!mt-2 !mb-1 !text-teal-800">
                  {stat.prefix}
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </Title>
                <div className="flex items-center">
                  <RiseOutlined className="mr-1 text-green-500" />
                  <Text strong className="text-green-500">
                    {stat.growth}
                  </Text>
                  <Text className="ml-2 text-teal-500">
                    from last month
                  </Text>
                </div>
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <div className="text-2xl" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;