// src/components/admin/dashboard/RecentOrders.jsx
import React from 'react';
import { Card, Table, Tag, Typography } from 'antd';

const { Title, Text } = Typography;

const RecentOrders = () => {
  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Smith",
      amount: "$245.99",
      status: "completed",
      date: "2024-01-24",
    },
    {
      id: "#ORD-002",
      customer: "Sarah Johnson",
      amount: "$129.50",
      status: "pending",
      date: "2024-01-24",
    },
    {
      id: "#ORD-003",
      customer: "Mike Wilson",
      amount: "$89.99",
      status: "processing",
      date: "2024-01-23",
    },
    {
      id: "#ORD-004",
      customer: "Emily Davis",
      amount: "$320.00",
      status: "completed",
      date: "2024-01-23",
    },
    {
      id: "#ORD-005",
      customer: "Robert Brown",
      amount: "$65.50",
      status: "cancelled",
      date: "2024-01-22",
    },
  ];

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <Text strong className="text-green-600">{text}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          completed: { color: "green", label: "Completed" },
          pending: { color: "orange", label: "Pending" },
          processing: { color: "blue", label: "Processing" },
          cancelled: { color: "red", label: "Cancelled" },
        };
        const config = statusConfig[status] || {
          color: "default",
          label: status,
        };
        return (
          <Tag color={config.color} className="px-3 py-1 rounded-full">
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <Card
      title={<Title level={4} className="!text-teal-800">Recent Orders</Title>}
      className="bg-white border-0 shadow-md"
      extra={
        <a className="text-teal-600 hover:text-teal-800">View All</a>
      }
    >
      <Table
        size="middle"
        columns={columns}
        dataSource={recentOrders}
        pagination={false}
        rowKey="id"
      />
    </Card>
  );
};

export default RecentOrders;