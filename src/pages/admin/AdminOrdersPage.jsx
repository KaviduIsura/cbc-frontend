// src/pages/admin/AdminOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import {
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
  Timeline,
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
  List,
  Empty,
  Pagination
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
  SyncOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  TruckOutlined,
  DollarOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CreditCardOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckOutlined,
  ClearOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  IdcardOutlined
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

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      notification.error({
        message: 'Session Expired',
        description: 'Please login again.',
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
    return Promise.reject(error);
  }
);

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [bulkUpdateModalVisible, setBulkUpdateModalVisible] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [statusForm] = Form.useForm();
  const [bulkStatusForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: null,
    paymentMethod: null,
    dateRange: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    preparing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [gridView, setGridView] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Status configurations
  const statusConfig = {
    pending: { 
      color: '#fa8c16', 
      label: 'Pending', 
      icon: <ClockCircleOutlined />,
      description: 'Order received, awaiting processing'
    },
    pending_payment: { 
      color: '#f5222d', 
      label: 'Payment Pending', 
      icon: <ExclamationCircleOutlined />,
      description: 'Awaiting payment (COD orders)'
    },
    preparing: { 
      color: '#1890ff', 
      label: 'Preparing', 
      icon: <SyncOutlined spin />,
      description: 'Order being prepared for shipping'
    },
    shipped: { 
      color: '#13c2c2', 
      label: 'Shipped', 
      icon: <TruckOutlined />,
      description: 'Order shipped to customer'
    },
    delivered: { 
      color: '#52c41a', 
      label: 'Delivered', 
      icon: <CheckCircleOutlined />,
      description: 'Order delivered to customer'
    },
    cancelled: { 
      color: '#ff4d4f', 
      label: 'Cancelled', 
      icon: <CloseCircleOutlined />,
      description: 'Order cancelled'
    },
    refunded: { 
      color: '#722ed1', 
      label: 'Refunded', 
      icon: <DollarOutlined />,
      description: 'Order refunded to customer'
    },
  };

  const paymentMethodConfig = {
    card: { color: 'blue', label: 'Credit Card', icon: <CreditCardOutlined /> },
    paypal: { color: 'indigo', label: 'PayPal', icon: <DollarOutlined /> },
    cod: { color: 'orange', label: 'Cash on Delivery', icon: <DollarOutlined /> },
  };

  const deliveryMethodConfig = {
    standard: { color: 'default', label: 'Standard', icon: <TruckOutlined /> },
    express: { color: 'orange', label: 'Express', icon: <TruckOutlined /> },
    overnight: { color: 'red', label: 'Overnight', icon: <TruckOutlined /> },
    free: { color: 'green', label: 'Free Shipping', icon: <TruckOutlined /> },
  };

  // Quick filter options
  const quickFilters = [
    { key: 'all', label: 'All Orders', count: stats.total, color: '#08979c' },
    { key: 'pending', label: 'Pending', count: stats.pending, color: '#fa8c16' },
    { key: 'preparing', label: 'Preparing', count: stats.preparing, color: '#1890ff' },
    { key: 'shipped', label: 'Shipped', count: stats.shipped, color: '#13c2c2' },
    { key: 'delivered', label: 'Delivered', count: stats.delivered, color: '#52c41a' },
    { key: 'cancelled', label: 'Cancelled', count: stats.cancelled, color: '#ff4d4f' },
  ];

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/orders', {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
        },
      });

      if (response.data.success) {
        const ordersData = response.data.orders || [];
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        setPagination({
          ...pagination,
          total: response.data.count || ordersData.length,
        });
        calculateStats(ordersData);
        
        notification.success({
          message: 'Data Loaded',
          description: `Successfully loaded ${ordersData.length} orders`,
          duration: 2,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      let errorMessage = 'Failed to fetch orders. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if backend is running.';
      }
      
      notification.error({
        message: 'Error Loading Orders',
        description: errorMessage,
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (ordersList) => {
    const statsData = {
      total: ordersList.length,
      pending: ordersList.filter(o => o.status === 'pending' || o.status === 'pending_payment').length,
      preparing: ordersList.filter(o => o.status === 'preparing').length,
      shipped: ordersList.filter(o => o.status === 'shipped').length,
      delivered: ordersList.filter(o => o.status === 'delivered').length,
      cancelled: ordersList.filter(o => ['cancelled', 'refunded'].includes(o.status)).length,
      revenue: ordersList
        .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
        .reduce((sum, order) => sum + (order.total || 0), 0),
    };
    setStats(statsData);
  };

  // Update order status
  const updateOrderStatus = async (orderId, status, notes = '') => {
    try {
      const response = await axiosInstance.put(`/api/orders/${orderId}/status`, { 
        status,
        notes 
      });

      if (response.data.success) {
        message.success(`Order status updated to ${statusConfig[status]?.label || status}`);
        fetchOrders();
        setStatusModalVisible(false);
        statusForm.resetFields();
        
        if (viewModalVisible) {
          setViewModalVisible(false);
        }
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      
      let errorMessage = 'Failed to update order status. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if backend is running.';
      }
      
      notification.error({
        message: 'Update Failed',
        description: errorMessage,
        duration: 5,
      });
    }
  };

  // Mark order as paid
  const markAsPaid = async (orderId) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${orderId}/mark-paid`);

      if (response.data.success) {
        message.success('Order marked as paid');
        fetchOrders();
      } else {
        throw new Error(response.data.message || 'Failed to mark as paid');
      }
    } catch (error) {
      console.error('Error marking order as paid:', error);
      notification.error({
        message: 'Update Failed',
        description: error.response?.data?.message || error.message || 'Failed to mark order as paid',
      });
    }
  };

  // Bulk status update
  const handleBulkStatusUpdate = async (status, notes = '') => {
    if (selectedOrders.length === 0) {
      notification.warning({
        message: 'No Orders Selected',
        description: 'Please select orders to update.',
      });
      return;
    }

    Modal.confirm({
      title: `Update ${selectedOrders.length} Orders`,
      content: `Are you sure you want to update ${selectedOrders.length} order(s) to "${statusConfig[status]?.label || status}"?`,
      okText: 'Update All',
      cancelText: 'Cancel',
      okButtonProps: { className: 'bg-teal-600 hover:bg-teal-700' },
      onOk: async () => {
        try {
          const promises = selectedOrders.map(orderId => 
            axiosInstance.put(`/api/orders/${orderId}/status`, { 
              status, 
              notes: notes || `Bulk update: ${statusConfig[status]?.label || status}` 
            })
          );
          
          const results = await Promise.allSettled(promises);
          
          const successful = results.filter(r => r.status === 'fulfilled').length;
          const failed = results.filter(r => r.status === 'rejected').length;
          
          if (failed === 0) {
            message.success(`Successfully updated ${successful} orders`);
          } else {
            message.warning(`Updated ${successful} orders, ${failed} failed`);
          }
          
          fetchOrders();
          setSelectedOrders([]);
          setBulkUpdateModalVisible(false);
          bulkStatusForm.resetFields();
        } catch (error) {
          console.error('Bulk update error:', error);
          notification.error({
            message: 'Bulk Update Failed',
            description: 'Failed to update some orders. Please try again.',
          });
        }
      },
    });
  };

  // View order details
  const viewOrderDetails = async (orderId) => {
    try {
      const response = await axiosInstance.get(`/api/orders/${orderId}`);

      if (response.data.success) {
        setSelectedOrder(response.data.order);
        setViewModalVisible(true);
      } else {
        throw new Error(response.data.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to fetch order details',
      });
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...orders];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(order =>
        order.orderId?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        (order.shippingInfo?.firstName + ' ' + order.shippingInfo?.lastName).toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Quick filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'pending') {
        filtered = filtered.filter(order => ['pending', 'pending_payment'].includes(order.status));
      } else {
        filtered = filtered.filter(order => order.status === selectedFilter);
      }
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Payment method filter
    if (filters.paymentMethod) {
      filtered = filtered.filter(order => order.paymentMethod === filters.paymentMethod);
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter(order =>
        dayjs(order.createdAt).isBetween(start, end, 'day', '[]')
      );
    }

    setFilteredOrders(filtered);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Export orders
  const exportOrders = () => {
    const dataStr = JSON.stringify(orders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `orders_${dayjs().format('YYYY-MM-DD_HH-mm')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    message.success('Orders exported successfully');
  };

  // Print invoice
  const printInvoice = (order) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #333; }
          .company-name { font-size: 24px; font-weight: bold; color: #08979c; }
          .invoice-title { font-size: 32px; margin: 10px 0; }
          .order-info { margin: 20px 0; }
          .section { margin: 30px 0; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #ddd; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #f8f9fa; text-align: left; padding: 12px; border-bottom: 2px solid #dee2e6; }
          td { padding: 12px; border-bottom: 1px solid #dee2e6; }
          .text-right { text-align: right; }
          .total-row { font-weight: bold; font-size: 18px; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">ELEVÉ</div>
          <div class="invoice-title">INVOICE</div>
          <div class="order-info">
            <div>Order ID: ${order.orderId}</div>
            <div>Date: ${dayjs(order.createdAt).format('MMMM D, YYYY')}</div>
            <div>Status: ${statusConfig[order.status]?.label || order.status}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Billing & Shipping Information</div>
          <div style="display: flex; justify-content: space-between;">
            <div>
              <strong>Bill To:</strong><br>
              ${order.shippingInfo?.firstName} ${order.shippingInfo?.lastName}<br>
              ${order.email}<br>
              ${order.shippingInfo?.phone}
            </div>
            <div>
              <strong>Ship To:</strong><br>
              ${order.shippingInfo?.firstName} ${order.shippingInfo?.lastName}<br>
              ${order.shippingInfo?.address}<br>
              ${order.shippingInfo?.city}, ${order.shippingInfo?.state} ${order.shippingInfo?.zipCode}<br>
              ${order.shippingInfo?.country}
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderedItems?.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td class="text-right">$${item.price?.toFixed(2)}</td>
                  <td class="text-right">$${(item.price * item.quantity)?.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section" style="float: right; width: 300px;">
          <div class="section-title">Order Summary</div>
          <table>
            <tr>
              <td>Subtotal:</td>
              <td class="text-right">$${order.subtotal?.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Shipping:</td>
              <td class="text-right">$${order.shipping?.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Tax:</td>
              <td class="text-right">$${order.tax?.toFixed(2)}</td>
            </tr>
            ${order.discount > 0 ? `
            <tr>
              <td>Discount:</td>
              <td class="text-right">-$${order.discount?.toFixed(2)}</td>
            </tr>
            ` : ''}
            ${order.codFee > 0 ? `
            <tr>
              <td>COD Fee:</td>
              <td class="text-right">$${order.codFee?.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr class="total-row">
              <td>Total:</td>
              <td class="text-right">$${order.total?.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <div style="clear: both;"></div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>ELEVÉ Beauty & Cosmetics</p>
          <p>support@eleve-beauty.com | www.eleve-beauty.com</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [pagination.current, pagination.pageSize]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, searchText, orders, selectedFilter]);

  // Order timeline component
  const OrderTimeline = ({ order }) => {
    const events = [
      {
        time: order.createdAt,
        title: 'Order Placed',
        color: 'green',
        icon: <ShoppingCartOutlined />,
      },
      ...(order.paidAt ? [{
        time: order.paidAt,
        title: 'Payment Received',
        color: 'blue',
        icon: <DollarOutlined />,
      }] : []),
      {
        time: order.updatedAt,
        title: 'Status Updated',
        color: 'orange',
        icon: <SyncOutlined />,
      },
      ...(order.status === 'delivered' ? [{
        time: order.updatedAt,
        title: 'Order Delivered',
        color: 'green',
        icon: <CheckCircleOutlined />,
      }] : []),
    ].filter(event => event.time);

    return (
      <Timeline>
        {events.map((event, index) => (
          <Timeline.Item
            key={index}
            color={event.color}
            dot={event.icon}
          >
            <div className="text-sm font-medium text-teal-800">{event.title}</div>
            <div className="text-xs text-teal-500">
              {dayjs(event.time).format('MMM D, YYYY h:mm A')}
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  };

  // Order Card Component
  const OrderCard = ({ order }) => {
    const statusConfigItem = statusConfig[order.status] || { color: 'default', label: order.status, icon: null };
    const paymentConfig = paymentMethodConfig[order.paymentMethod] || { color: 'default', label: order.paymentMethod };
    const customerName = `${order.shippingInfo?.firstName || ''} ${order.shippingInfo?.lastName || ''}`.trim();

    return (
      <Card
        className={`transition-all duration-300 hover:shadow-lg border ${
          selectedOrders.includes(order._id) 
            ? 'border-teal-500 bg-teal-50' 
            : 'border-teal-100 hover:border-teal-300'
        }`}
        onClick={(e) => {
          if (e.target.closest('.order-actions') || e.target.closest('.ant-checkbox-wrapper')) {
            return;
          }
          viewOrderDetails(order._id);
        }}
        hoverable
        size="small"
      >
        <div className="relative">
          {/* Selection Checkbox */}
          <div className="absolute z-10 top-2 right-2 order-actions">
            <Switch
              size="small"
              checked={selectedOrders.includes(order._id)}
              onChange={(checked) => handleOrderSelect(order._id)}
              className={`${selectedOrders.includes(order._id) ? 'bg-teal-600' : ''}`}
            />
          </div>

          {/* Order Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <IdcardOutlined className="text-teal-500" />
                <Text strong className="text-teal-800 truncate">
                  {order.orderId}
                </Text>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-teal-600">
                <CalendarOutlined />
                {dayjs(order.createdAt).format('MMM D, YYYY')}
              </div>
            </div>
            <Tag 
              color={statusConfigItem.color} 
              className="px-2 py-0.5 text-xs capitalize"
              icon={statusConfigItem.icon}
            >
              {statusConfigItem.label}
            </Tag>
          </div>

          {/* Customer Info */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <UserOutlined className="text-teal-500" />
              <Text className="text-sm font-medium text-teal-800 truncate">
                {customerName || 'Unknown Customer'}
              </Text>
            </div>
            <div className="flex items-center gap-2 text-xs text-teal-600 truncate">
              <MailOutlined />
              {order.email || 'No email'}
            </div>
            {order.shippingInfo?.phone && (
              <div className="flex items-center gap-2 text-xs text-teal-600 truncate">
                <PhoneOutlined />
                {order.shippingInfo.phone}
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div>
              <div className="text-teal-500">Items</div>
              <div className="font-medium text-teal-800">
                {order.orderedItems?.length || 0}
              </div>
            </div>
            <div>
              <div className="text-teal-500">Payment</div>
              <div>
                <Tag color={paymentConfig.color} className="px-1 py-0 text-xs">
                  {paymentConfig.label}
                </Tag>
              </div>
            </div>
            {order.shippingInfo?.city && (
              <div className="col-span-2">
                <div className="flex items-center gap-1 text-teal-500">
                  <EnvironmentOutlined />
                  <span>Location</span>
                </div>
                <div className="font-medium text-teal-800 truncate">
                  {order.shippingInfo.city}, {order.shippingInfo.state}
                </div>
              </div>
            )}
          </div>

          {/* Amount and Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-teal-100">
            <div>
              <div className="text-xs text-teal-500">Total Amount</div>
              <div className="text-lg font-bold text-green-600">
                ${order.total?.toFixed(2) || '0.00'}
              </div>
            </div>
            
            <Space className="order-actions">
              <Tooltip title="View Details">
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => viewOrderDetails(order._id)}
                  className="text-teal-600 hover:text-teal-700"
                />
              </Tooltip>
              
              <Tooltip title="Quick Actions">
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'view',
                        label: 'View Details',
                        icon: <EyeOutlined />,
                        onClick: () => viewOrderDetails(order._id),
                      },
                      {
                        key: 'update',
                        label: 'Update Status',
                        icon: <EditOutlined />,
                        onClick: () => {
                          setSelectedOrder(order);
                          statusForm.setFieldsValue({ status: order.status });
                          setStatusModalVisible(true);
                        },
                      },
                      {
                        key: 'print',
                        label: 'Print Invoice',
                        icon: <PrinterOutlined />,
                        onClick: () => printInvoice(order),
                      },
                      order.paymentMethod === 'cod' && !order.isPaid ? {
                        key: 'markPaid',
                        label: 'Mark as Paid',
                        icon: <CheckCircleOutlined />,
                        onClick: () => markAsPaid(order._id),
                      } : null,
                    ].filter(Boolean),
                  }}
                  trigger={['click']}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<MoreOutlined />}
                    className="text-gray-600 hover:text-gray-700"
                  />
                </Dropdown>
              </Tooltip>
            </Space>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Title level={2} className="!text-teal-800">
            Orders Management
          </Title>
          <Text className="text-teal-600">
            Manage and track customer orders efficiently
          </Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchOrders}
            loading={loading}
            className="text-teal-600 border-teal-200 hover:text-teal-700 hover:border-teal-300"
          >
            Refresh
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={exportOrders}
            className="text-teal-600 border-teal-200 hover:text-teal-700 hover:border-teal-300"
          >
            Export
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="border-0 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
          >
            Create Order
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {[
          { 
            title: 'Total Orders', 
            value: stats.total, 
            color: '#08979c', 
            icon: <ShoppingCartOutlined />,
            change: '+12%',
          },
          { 
            title: 'Total Revenue', 
            value: `$${stats.revenue.toFixed(2)}`, 
            color: '#10b981', 
            icon: <DollarOutlined />,
            change: '+18%',
          },
          { 
            title: 'Pending Orders', 
            value: stats.pending, 
            color: '#f59e0b', 
            icon: <ClockCircleOutlined />,
            change: '-5%',
          },
          { 
            title: 'In Progress', 
            value: stats.preparing + stats.shipped, 
            color: '#3b82f6', 
            icon: <SyncOutlined spin />,
            change: '+8%',
          },
          { 
            title: 'Delivered', 
            value: stats.delivered, 
            color: '#22c55e', 
            icon: <CheckCircleOutlined />,
            change: '+15%',
          },
          { 
            title: 'Cancelled', 
            value: stats.cancelled, 
            color: '#ef4444', 
            icon: <CloseCircleOutlined />,
            change: '-2%',
          },
        ].map((stat, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={4}>
            <Card
              className="transition-shadow bg-white border-0 shadow-sm hover:shadow-md"
              styles={{ body: { padding: '16px' } }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-teal-800">
                    {stat.value}
                  </div>
                  <div className="text-sm text-teal-600">
                    {stat.title}
                  </div>
                  <div className="mt-1 text-xs text-teal-500">
                    {stat.change} from last month
                  </div>
                </div>
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <div className="text-xl" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Filters */}
      <Card className="bg-white border-0 shadow-sm">
        <div className="flex flex-col justify-between gap-4 mb-4 md:flex-row md:items-center">
          <Title level={5} className="!mb-0 !text-teal-800">
            Quick Filters
          </Title>
          <div className="text-sm text-teal-600">
            {selectedOrders.length} order(s) selected
            {selectedOrders.length > 0 && (
              <Button
                type="link"
                size="small"
                onClick={() => setSelectedOrders([])}
                className="ml-2 text-teal-600"
              >
                Clear Selection
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <Button
              key={filter.key}
              type={selectedFilter === filter.key ? 'primary' : 'default'}
              className={`border-teal-200 ${
                selectedFilter === filter.key 
                  ? 'bg-teal-600 border-teal-600' 
                  : 'text-teal-600 hover:text-teal-700 hover:border-teal-300'
              }`}
              onClick={() => setSelectedFilter(filter.key)}
            >
              {filter.label}
              <Badge
                count={filter.count}
                showZero
                size="small"
                className="ml-2"
                style={{ backgroundColor: filter.color }}
              />
            </Button>
          ))}
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card className="bg-white border-0 border-l-4 shadow-sm border-l-teal-500">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <Text strong className="text-teal-700">
                {selectedOrders.length} order(s) selected
              </Text>
              <div className="mt-1 text-sm text-teal-600">
                Select actions to perform on all selected orders
              </div>
            </div>
            <Space>
              <Button
                size="small"
                onClick={() => setSelectedOrders([])}
                className="text-teal-600 border-teal-200 hover:text-teal-700"
                icon={<ClearOutlined />}
              >
                Clear Selection
              </Button>
              
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'shipped',
                      label: 'Mark as Shipped',
                      icon: <TruckOutlined />,
                      onClick: () => handleBulkStatusUpdate('shipped'),
                    },
                    {
                      key: 'delivered',
                      label: 'Mark as Delivered',
                      icon: <CheckCircleOutlined />,
                      onClick: () => handleBulkStatusUpdate('delivered'),
                    },
                    {
                      key: 'cancelled',
                      label: 'Mark as Cancelled',
                      icon: <CloseCircleOutlined />,
                      onClick: () => handleBulkStatusUpdate('cancelled'),
                    },
                    {
                      type: 'divider',
                    },
                    {
                      key: 'custom',
                      label: 'Custom Status Update',
                      icon: <EditOutlined />,
                      onClick: () => setBulkUpdateModalVisible(true),
                    },
                  ],
                }}
              >
                <Button
                  type="primary"
                  size="small"
                  className="bg-teal-600 border-0 hover:bg-teal-700"
                  icon={<EditOutlined />}
                >
                  Bulk Update ({selectedOrders.length})
                </Button>
              </Dropdown>
            </Space>
          </div>
        </Card>
      )}

      {/* Filters Card */}
      <Card
        className="bg-white border-0 shadow-sm"
        title={
          <div className="flex items-center">
            <FilterOutlined className="mr-2 text-teal-600" />
            <span className="text-teal-800">Advanced Filters</span>
          </div>
        }
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search by Order ID, Name, or Email..."
              prefix={<SearchOutlined className="text-teal-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border-teal-200 hover:border-teal-300 focus:border-teal-500"
              allowClear
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Status"
              allowClear
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              className="border-teal-200 hover:border-teal-300"
            >
              {Object.entries(statusConfig).map(([value, config]) => (
                <Option key={value} value={value}>
                  <Tag color={config.color}>{config.label}</Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Payment Method"
              allowClear
              style={{ width: '100%' }}
              value={filters.paymentMethod}
              onChange={(value) => setFilters({ ...filters, paymentMethod: value })}
              className="border-teal-200 hover:border-teal-300"
            >
              {Object.entries(paymentMethodConfig).map(([value, config]) => (
                <Option key={value} value={value}>
                  <Tag color={config.color}>{config.label}</Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              className="border-teal-200 hover:border-teal-300"
            />
          </Col>
          <Col xs={24} md={4}>
            <Button
              block
              onClick={() => {
                setSearchText('');
                setSelectedFilter('all');
                setFilters({
                  status: null,
                  paymentMethod: null,
                  dateRange: null,
                });
              }}
              className="text-teal-600 border-teal-200 hover:text-teal-700 hover:border-teal-300"
            >
              Clear All
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Orders Grid */}
      <Card
        className="bg-white border-0 shadow-sm"
        title={
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <Title level={4} className="!mb-0 !text-teal-800">
                All Orders
              </Title>
              <Text className="text-teal-600">
                {filteredOrders.length} orders found • ${stats.revenue.toFixed(2)} total revenue
              </Text>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-teal-600">
                View
              </div>
              <Switch
                checkedChildren="Grid"
                unCheckedChildren="List"
                checked={gridView}
                onChange={setGridView}
              />
              <div className="text-sm text-teal-600">
                Showing {((pagination.current - 1) * pagination.pageSize) + 1}-
                {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total}
              </div>
            </div>
          </div>
        }
      >
        <Spin spinning={loading}>
          {filteredOrders.length === 0 ? (
            <Empty
              description={
                <span className="text-teal-600">
                  No orders found. Try adjusting your filters.
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="py-12"
            />
          ) : gridView ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredOrders
                .slice(
                  (pagination.current - 1) * pagination.pageSize,
                  pagination.current * pagination.pageSize
                )
                .map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
            </div>
          ) : (
            <List
              dataSource={filteredOrders.slice(
                (pagination.current - 1) * pagination.pageSize,
                pagination.current * pagination.pageSize
              )}
              renderItem={(order) => (
                <List.Item
                  className={`p-4 mb-2 transition-colors rounded-lg border ${
                    selectedOrders.includes(order._id)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-teal-100 hover:bg-teal-50'
                  }`}
                  actions={[
                    <Tooltip title="View Details">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => viewOrderDetails(order._id)}
                        className="text-teal-600 hover:text-teal-700"
                      />
                    </Tooltip>,
                    <Tooltip title="Update Status">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setSelectedOrder(order);
                          statusForm.setFieldsValue({ status: order.status });
                          setStatusModalVisible(true);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      />
                    </Tooltip>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="flex items-center gap-2">
                        <Switch
                          size="small"
                          checked={selectedOrders.includes(order._id)}
                          onChange={(checked) => handleOrderSelect(order._id)}
                          className={`${selectedOrders.includes(order._id) ? 'bg-teal-600' : ''}`}
                        />
                        <Avatar
                          style={{ backgroundColor: statusConfig[order.status]?.color || '#08979c' }}
                          icon={<ShoppingCartOutlined />}
                        />
                      </div>
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <Text strong className="text-teal-800">
                          {order.orderId}
                        </Text>
                        <Tag 
                          color={statusConfig[order.status]?.color || 'default'} 
                          className="text-xs"
                        >
                          {statusConfig[order.status]?.label || order.status}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="space-y-1">
                        <div className="text-teal-700">
                          {order.shippingInfo?.firstName} {order.shippingInfo?.lastName} • {order.email}
                        </div>
                        <div className="text-sm text-teal-600">
                          {dayjs(order.createdAt).format('MMM D, YYYY h:mm A')} • 
                          {order.shippingInfo?.city && ` ${order.shippingInfo.city}, ${order.shippingInfo.state}`}
                        </div>
                      </div>
                    }
                  />
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ${order.total?.toFixed(2)}
                    </div>
                    <div className="text-xs text-teal-600">
                      {order.orderedItems?.length} items
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={filteredOrders.length}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => (
                <Text className="text-teal-600">
                  {range[0]}-{range[1]} of {total} orders
                </Text>
              )}
              pageSizeOptions={['12', '24', '48', '96']}
            />
          </div>
        </Spin>
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <div>
              <Title level={3} className="!mb-0 !text-teal-800">
                Order Details: {selectedOrder?.orderId}
              </Title>
              <Text type="secondary" className="text-teal-600">
                Placed on {selectedOrder && dayjs(selectedOrder.createdAt).format('MMMM D, YYYY h:mm A')}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Tag 
                color={statusConfig[selectedOrder?.status]?.color || 'default'} 
                className="px-3 py-1 capitalize"
              >
                {statusConfig[selectedOrder?.status]?.label || selectedOrder?.status}
              </Tag>
              {selectedOrder?.paymentMethod === 'cod' && !selectedOrder?.isPaid && (
                <Tag color="red" icon={<ExclamationCircleOutlined />} className="text-xs">
                  Payment Pending
                </Tag>
              )}
            </div>
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={1200}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="print"
            icon={<PrinterOutlined />}
            onClick={() => printInvoice(selectedOrder)}
            className="text-teal-600 border-teal-200 hover:text-teal-700"
          >
            Print Invoice
          </Button>,
          <Button
            key="update"
            type="primary"
            onClick={() => {
              setViewModalVisible(false);
              statusForm.setFieldsValue({ status: selectedOrder?.status });
              setStatusModalVisible(true);
            }}
            className="bg-teal-600 border-0 hover:bg-teal-700"
          >
            Update Status
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <Tabs defaultActiveKey="1" className="custom-tabs">
              <TabPane tab="Order Summary" key="1">
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={16}>
                    {/* Order Items */}
                    <Card
                      title={
                        <div className="flex items-center">
                          <ShoppingCartOutlined className="mr-2 text-teal-600" />
                          <span className="text-teal-800">Order Items ({selectedOrder.orderedItems?.length})</span>
                        </div>
                      }
                      className="mb-4 border-0 shadow-sm"
                    >
                      <List
                        dataSource={selectedOrder.orderedItems}
                        renderItem={(item) => (
                          <List.Item className="py-3 border-0 border-b border-teal-100 last:border-b-0">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <Avatar
                                  src={item.image}
                                  shape="square"
                                  size={48}
                                  className="mr-3 border border-teal-100"
                                />
                                <div>
                                  <div className="font-medium text-teal-800">{item.name}</div>
                                  <div className="text-xs text-teal-500">SKU: {item.productId?.slice(-8)}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-teal-800">${item.price?.toFixed(2)}</div>
                                <div className="text-sm text-teal-600">Qty: {item.quantity}</div>
                                <div className="font-bold text-green-600">${(item.price * item.quantity)?.toFixed(2)}</div>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Card>

                    {/* Order Timeline */}
                    <Card
                      title={
                        <div className="flex items-center">
                          <ClockCircleOutlined className="mr-2 text-teal-600" />
                          <span className="text-teal-800">Order Timeline</span>
                        </div>
                      }
                      className="border-0 shadow-sm"
                    >
                      <OrderTimeline order={selectedOrder} />
                    </Card>
                  </Col>

                  <Col xs={24} lg={8}>
                    {/* Shipping Information */}
                    <Card
                      title={
                        <div className="flex items-center">
                          <TruckOutlined className="mr-2 text-teal-600" />
                          <span className="text-teal-800">Shipping Information</span>
                        </div>
                      }
                      className="mb-4 border-0 shadow-sm"
                    >
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Name" className="text-teal-800">
                          {selectedOrder.shippingInfo?.firstName} {selectedOrder.shippingInfo?.lastName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email" className="text-teal-800">
                          {selectedOrder.shippingInfo?.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone" className="text-teal-800">
                          {selectedOrder.shippingInfo?.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Address" className="text-teal-800">
                          {selectedOrder.shippingInfo?.address}
                          {selectedOrder.shippingInfo?.apartment && `, ${selectedOrder.shippingInfo.apartment}`}
                        </Descriptions.Item>
                        <Descriptions.Item label="City/State/Zip" className="text-teal-800">
                          {selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.state} {selectedOrder.shippingInfo?.zipCode}
                        </Descriptions.Item>
                        <Descriptions.Item label="Country" className="text-teal-800">
                          {selectedOrder.shippingInfo?.country}
                        </Descriptions.Item>
                        <Descriptions.Item label="Delivery Method" className="text-teal-800">
                          <Tag color={deliveryMethodConfig[selectedOrder.deliveryMethod]?.color || 'default'}>
                            {deliveryMethodConfig[selectedOrder.deliveryMethod]?.label || selectedOrder.deliveryMethod}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>

                    {/* Payment Information */}
                    <Card
                      title={
                        <div className="flex items-center">
                          <CreditCardOutlined className="mr-2 text-teal-600" />
                          <span className="text-teal-800">Payment Information</span>
                        </div>
                      }
                      className="mb-4 border-0 shadow-sm"
                    >
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Payment Method" className="text-teal-800">
                          <Tag color={paymentMethodConfig[selectedOrder.paymentMethod]?.color || 'default'}>
                            {paymentMethodConfig[selectedOrder.paymentMethod]?.label || selectedOrder.paymentMethod}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Payment Status" className="text-teal-800">
                          {selectedOrder.isPaid ? (
                            <Tag color="green" icon={<CheckCircleOutlined />}>Paid</Tag>
                          ) : (
                            <Tag color="red" icon={<ExclamationCircleOutlined />}>Pending</Tag>
                          )}
                        </Descriptions.Item>
                        {selectedOrder.paymentInfo?.cardNumber && (
                          <Descriptions.Item label="Card" className="text-teal-800">
                            **** **** **** {selectedOrder.paymentInfo.cardNumber.slice(-4)}
                          </Descriptions.Item>
                        )}
                        {selectedOrder.paymentInfo?.cardName && (
                          <Descriptions.Item label="Cardholder" className="text-teal-800">
                            {selectedOrder.paymentInfo.cardName}
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    </Card>

                    {/* Order Summary */}
                    <Card
                      title={
                        <div className="flex items-center">
                          <FileTextOutlined className="mr-2 text-teal-600" />
                          <span className="text-teal-800">Order Summary</span>
                        </div>
                      }
                      className="border-0 shadow-sm"
                    >
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Subtotal" className="text-teal-800">
                          ${selectedOrder.subtotal?.toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Shipping" className="text-teal-800">
                          ${selectedOrder.shipping?.toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tax" className="text-teal-800">
                          ${selectedOrder.tax?.toFixed(2)}
                        </Descriptions.Item>
                        {selectedOrder.discount > 0 && (
                          <Descriptions.Item label="Discount" className="text-teal-800">
                            -${selectedOrder.discount?.toFixed(2)}
                          </Descriptions.Item>
                        )}
                        {selectedOrder.codFee > 0 && (
                          <Descriptions.Item label="COD Fee" className="text-teal-800">
                            ${selectedOrder.codFee?.toFixed(2)}
                          </Descriptions.Item>
                        )}
                        <Divider style={{ margin: '8px 0' }} />
                        <Descriptions.Item label="Total" className="text-teal-800">
                          <Text strong className="text-lg text-green-600">
                            ${selectedOrder.total?.toFixed(2)}
                          </Text>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Customer Information" key="2">
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Card className="border-0 shadow-sm">
                      <div className="flex items-center mb-6">
                        <Avatar 
                          size={64} 
                          className="mr-4 border-2 border-teal-100"
                          src={`https://ui-avatars.com/api/?name=${selectedOrder.shippingInfo?.firstName}+${selectedOrder.shippingInfo?.lastName}&background=08979c&color=fff`}
                        >
                          {selectedOrder.shippingInfo?.firstName?.[0]}{selectedOrder.shippingInfo?.lastName?.[0]}
                        </Avatar>
                        <div>
                          <Title level={4} className="!mb-1 !text-teal-800">
                            {selectedOrder.shippingInfo?.firstName} {selectedOrder.shippingInfo?.lastName}
                          </Title>
                          <Space>
                            <Tag icon={<MailOutlined />} className="text-teal-700 border-teal-200 bg-teal-50">
                              {selectedOrder.email}
                            </Tag>
                            <Tag icon={<PhoneOutlined />} className="text-teal-700 border-teal-200 bg-teal-50">
                              {selectedOrder.shippingInfo?.phone}
                            </Tag>
                            <Tag icon={<UserOutlined />} className="text-teal-700 border-teal-200 bg-teal-50">
                              Customer since {dayjs(selectedOrder.createdAt).format('MMM YYYY')}
                            </Tag>
                          </Space>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Notes" key="3">
                <Card className="border-0 shadow-sm">
                  {selectedOrder.notes || selectedOrder.orderNotes ? (
                    <Paragraph className="text-teal-800">
                      {selectedOrder.notes || selectedOrder.orderNotes}
                    </Paragraph>
                  ) : (
                    <div className="py-8 text-center text-teal-500">
                      <FileTextOutlined className="mb-4 text-4xl" />
                      <div>No notes for this order</div>
                    </div>
                  )}
                </Card>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="mr-2 text-teal-600" />
            <span className="text-teal-800">Update Order Status</span>
          </div>
        }
        open={statusModalVisible}
        onCancel={() => {
          setStatusModalVisible(false);
          statusForm.resetFields();
        }}
        onOk={() => statusForm.submit()}
        okText="Update Status"
        okButtonProps={{
          className: 'bg-teal-600 hover:bg-teal-700 border-0',
          icon: <CheckCircleOutlined />,
        }}
        cancelButtonProps={{
          className: 'border-teal-200 text-teal-600 hover:text-teal-700',
        }}
        width={500}
        destroyOnClose
      >
        {selectedOrder && (
          <div className="p-3 mb-4 rounded-lg bg-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <Text strong className="text-teal-800">{selectedOrder.orderId}</Text>
                <div className="text-sm text-teal-600">
                  Customer: {selectedOrder.shippingInfo?.firstName} {selectedOrder.shippingInfo?.lastName}
                </div>
              </div>
              <Tag 
                color={statusConfig[selectedOrder.status]?.color || 'default'} 
                className="capitalize"
              >
                Current: {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
              </Tag>
            </div>
          </div>
        )}

        <Form
          form={statusForm}
          layout="vertical"
          onFinish={(values) => {
            if (selectedOrder) {
              updateOrderStatus(selectedOrder._id, values.status, values.notes);
            }
          }}
        >
          <Form.Item
            name="status"
            label={
              <div className="flex items-center">
                <span className="text-teal-700">Select New Status</span>
                <span className="ml-1 text-red-500">*</span>
              </div>
            }
            rules={[{ required: true, message: 'Please select a new status' }]}
          >
            <Select 
              placeholder="Select status" 
              className="w-full"
              showSearch
              optionFilterProp="children"
            >
              {Object.entries(statusConfig).map(([value, config]) => (
                <Option key={value} value={value}>
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 mr-2 rounded-full" 
                      style={{ backgroundColor: config.color }}
                    />
                    <span>{config.label}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="notes"
            label={
              <div className="flex items-center">
                <span className="text-teal-700">Status Update Notes (Optional)</span>
                <span className="ml-1 text-xs text-teal-500">Add internal notes about this change</span>
              </div>
            }
          >
            <Input.TextArea 
              rows={3} 
              placeholder="e.g., Package shipped via DHL with tracking number ABC123..." 
              className="border-teal-200 hover:border-teal-300 focus:border-teal-500"
              maxLength={500}
              showCount
            />
          </Form.Item>
          
          {/* Status Descriptions */}
          <div className="p-3 mb-4 rounded-lg bg-gray-50">
            <Text strong className="block mb-2 text-sm text-gray-700">Status Meanings:</Text>
            <div className="space-y-1 text-xs text-gray-600">
              {Object.entries(statusConfig).map(([key, config]) => (
                <div key={key}>
                  <Tag color={config.color} size="small">{config.label}</Tag> - {config.description}
                </div>
              ))}
            </div>
          </div>
        </Form>
      </Modal>

      {/* Bulk Update Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="mr-2 text-teal-600" />
            <span className="text-teal-800">Bulk Update {selectedOrders.length} Orders</span>
          </div>
        }
        open={bulkUpdateModalVisible}
        onCancel={() => {
          setBulkUpdateModalVisible(false);
          bulkStatusForm.resetFields();
        }}
        onOk={() => bulkStatusForm.submit()}
        okText={`Update ${selectedOrders.length} Orders`}
        okButtonProps={{
          className: 'bg-teal-600 hover:bg-teal-700 border-0',
          icon: <CheckCircleOutlined />,
        }}
        cancelButtonProps={{
          className: 'border-teal-200 text-teal-600 hover:text-teal-700',
        }}
        width={500}
      >
        <Form
          form={bulkStatusForm}
          layout="vertical"
          onFinish={(values) => {
            handleBulkStatusUpdate(values.status, values.notes);
          }}
        >
          <Form.Item
            name="status"
            label="Select New Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select status" className="w-full">
              {Object.entries(statusConfig).map(([value, config]) => (
                <Option key={value} value={value}>
                  <Tag color={config.color}>{config.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Update Notes (Optional)"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Add notes for this bulk update..." 
              className="border-teal-200 hover:border-teal-300"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;