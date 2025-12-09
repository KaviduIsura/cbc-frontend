import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Badge, 
  Modal, 
  Space,
  Spin,
  Tooltip,
  Dropdown,
  Menu,
  Empty,
  Avatar
} from "antd";

// Import icons using named imports - This is the correct way for Ant Design v6
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  PictureOutlined,
  SyncOutlined,
  EllipsisOutlined
} from "@ant-design/icons";

import Search from "antd/es/input/Search";

const { Meta } = Card;
const { Option } = Select;

// Default placeholder image
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=987&auto=format&fit=crop";

// Image Placeholder Component
const ImagePlaceholder = ({ size = "h-48", showLabel = true }) => (
  <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${size}`}>
    <PictureOutlined className="mb-2 text-4xl text-gray-400" />
    {showLabel && <p className="text-sm text-gray-500">No Image</p>}
  </div>
);

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
      let productsData = [];
      
      if (response.data.products) {
        productsData = response.data.products;
      } else if (response.data.list) {
        productsData = response.data.list;
      }
      
      // Clean up image URLs
      const cleanedProducts = productsData.map(product => ({
        ...product,
        images: (product.images || [])
          .map(url => {
            if (!url) return null;
            let cleanedUrl = url;
            if (url.includes('NaN')) {
              cleanedUrl = url.replace(/NaN[^.]*/, '').replace(/(\.\w+)$/, '$1');
            }
            if (!cleanedUrl.startsWith('http')) {
              return null;
            }
            return cleanedUrl;
          })
          .filter(url => url && url.trim() !== '')
      }));
      
      setProducts(cleanedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/categories`);
      if (response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([
        { category: 'all', count: products.length },
        { category: 'perfumes', count: 0 },
        { category: 'skincare', count: 0 },
        { category: 'makeup', count: 0 },
        { category: 'tools', count: 0 },
      ]);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteModalVisible(false);
      setProductToDelete(null);
    }
  };

  const showDeleteConfirm = (product) => {
    setProductToDelete(product);
    setDeleteModalVisible(true);
  };

  const getCategoryColor = (category) => {
    switch(category?.toLowerCase()) {
      case 'perfumes': return 'purple';
      case 'skincare': return 'blue';
      case 'makeup': return 'pink';
      case 'tools': return 'green';
      default: return 'default';
    }
  };

  const getStatusTag = (product) => {
    if (product.isNew) {
      return <Tag color="green" className="text-xs">NEW</Tag>;
    }
    if (product.isBestSeller) {
      return <Tag color="red" className="text-xs">BEST SELLER</Tag>;
    }
    if (product.stock === 0) {
      return <Tag color="orange" className="text-xs">OUT OF STOCK</Tag>;
    }
    return null;
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => new Set([...prev, productId]));
  };

  const getProductImage = (product) => {
    const productId = product._id || product.productId;
    const hasImageError = imageErrors.has(productId);
    
    if (hasImageError || !product.images || product.images.length === 0) {
      return null;
    }
    
    const firstImage = product.images[0];
    if (!firstImage || firstImage.includes('NaN')) {
      return null;
    }
    
    return firstImage;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchText === "" || 
      product.productName?.toLowerCase().includes(searchText.toLowerCase()) ||
      product.productId?.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || 
      product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category) => {
    if (!category || category === 'all') return 'All Products';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const menu = (product) => (
    <Menu
      items={[
        {
          key: '1',
          label: 'View Details',
          icon: <EyeOutlined />,
          onClick: () => window.open(`/product/${product.productId}`, '_blank')
        },
        {
          key: '2',
          label: 'Edit Product',
          icon: <EditOutlined />,
          onClick: () => window.location.href = `/admin/products/edit/${product.productId}`
        },
        {
          key: '3',
          label: 'Duplicate',
          icon: <PlusOutlined />,
          onClick: () => {/* Handle duplicate */ }
        },
        {
          type: 'divider',
        },
        {
          key: '4',
          label: 'Delete',
          icon: <DeleteOutlined />,
          danger: true,
          onClick: () => showDeleteConfirm(product)
        },
      ]}
    />
  );

  return (
    <div className="min-h-screen p-4 bg-gray-50 md:p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-500">Manage your store's product inventory</p>
        </div>
        
        <Space>
          <Link to="/admin/products/add">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              size="large"
            >
              Add Product
            </Button>
          </Link>
        </Space>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Search products..."
              allowClear
              enterButton="Search"
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={setSearchText}
            />
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by category"
              size="large"
              className="w-full"
              value={categoryFilter}
              onChange={setCategoryFilter}
              dropdownMatchSelectWidth={false}
            >
              <Option value="all">
                <Space>
                  <span>All Products</span>
                  <Badge count={products.length} style={{ backgroundColor: '#1890ff' }} />
                </Space>
              </Option>
              {categories
                .filter(cat => cat.category !== 'all')
                .map(cat => (
                  <Option key={cat.category} value={cat.category}>
                    <Space>
                      <span>{getCategoryLabel(cat.category)}</span>
                      <Badge count={cat.count} style={{ backgroundColor: '#52c41a' }} />
                    </Space>
                  </Option>
                ))}
            </Select>
          </Col>
          
          <Col xs={24} sm={24} md={8} lg={12} className="text-right">
            <Space>
              <Button 
                onClick={fetchProducts} 
                icon={<SyncOutlined spin={loading} />}
                disabled={loading}
              >
                Refresh
              </Button>
              <span className="text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spin size="large" tip="Loading products...">
            <div className="content" />
          </Spin>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="shadow-sm">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-500">
                {products.length === 0 ? "No products found. Add your first product!" : "No products match your filters"}
              </span>
            }
          >
            {products.length === 0 && (
              <Link to="/admin/products/add">
                <Button type="primary" size="large">Add Product</Button>
              </Link>
            )}
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProducts.map((product) => {
            const productId = product._id || product.productId;
            const imageUrl = getProductImage(product);
            const hasImage = !!imageUrl;
            
            return (
              <Col key={productId} xs={24} sm={12} md={8} lg={6}>
                <Card
                  className="h-full transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300"
                  cover={
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      {hasImage ? (
                        <>
                          <img
                            alt={product.productName}
                            src={imageUrl}
                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                            onError={() => handleImageError(productId)}
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2">
                            {getStatusTag(product)}
                          </div>
                        </>
                      ) : (
                        <>
                          <ImagePlaceholder />
                          <div className="absolute top-2 right-2">
                            {getStatusTag(product)}
                          </div>
                        </>
                      )}
                    </div>
                  }
                  actions={[
                    <Tooltip title="Edit" key="edit">
                      <Button 
                        type="text" 
                        icon={<EditOutlined />}
                        onClick={() => window.location.href = `/admin/products/edit/${product.productId}`}
                        className="text-blue-500 hover:text-blue-700"
                      />
                    </Tooltip>,
                    <Tooltip title="Quick View" key="view">
                      <Button 
                        type="text" 
                        icon={<EyeOutlined />}
                        onClick={() => window.open(`/product/${product.productId}`, '_blank')}
                        className="text-green-500 hover:text-green-700"
                      />
                    </Tooltip>,
                    <Tooltip title="Delete" key="delete">
                      <Button 
                        type="text" 
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(product)}
                        className="text-red-500 hover:text-red-700"
                      />
                    </Tooltip>,
                  ]}
                >
                  <Meta
                    title={
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-gray-800 truncate">
                          {product.productName || 'Unnamed Product'}
                        </span>
                        <Dropdown overlay={menu(product)} trigger={['click']}>
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<EllipsisOutlined className="text-gray-500" />}
                          />
                        </Dropdown>
                      </div>
                    }
                    description={
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Tag color={getCategoryColor(product.category)} className="text-xs">
                            {getCategoryLabel(product.category || 'uncategorized').toUpperCase()}
                          </Tag>
                          <span className="text-lg font-bold text-gray-800">
                            ${(product.lastPrice || product.price || 0).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                          {product.description || 'No description available'}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 text-sm border-t border-gray-100">
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Stock:</span>
                            <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                              {product.stock || 0}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-500">ID:</span>
                            <span className="px-2 py-1 font-mono text-xs bg-gray-100 rounded">
                              {product.productId}
                            </span>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <div className="flex flex-wrap gap-1">
                            {product.isNew && (
                              <Tag color="green" className="m-0 text-xs">
                                New Arrival
                              </Tag>
                            )}
                            {product.isBestSeller && (
                              <Tag color="red" className="m-0 text-xs">
                                Best Seller
                              </Tag>
                            )}
                            {product.rating > 0 && (
                              <Tag color="gold" className="m-0 text-xs">
                                ⭐ {product.rating.toFixed(1)} ({product.reviewCount || 0})
                              </Tag>
                            )}
                            {(!product.images || product.images.length === 0) && (
                              <Tag color="warning" className="m-0 text-xs">
                                No Image
                              </Tag>
                            )}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={() => handleDelete(productToDelete?.productId)}
        onCancel={() => {
          setDeleteModalVisible(false);
          setProductToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ 
          danger: true,
          type: 'primary'
        }}
        cancelButtonProps={{ type: 'default' }}
        centered
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            {productToDelete?.images?.[0] ? (
              <Avatar 
                src={productToDelete.images[0]} 
                size={64}
                shape="square"
                icon={<PictureOutlined />}
              />
            ) : (
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded">
                <PictureOutlined className="text-2xl text-gray-400" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-800">{productToDelete?.productName}</p>
              <p className="text-sm text-gray-500">ID: {productToDelete?.productId}</p>
            </div>
          </div>
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{productToDelete?.productName}</strong>?
          </p>
          <p className="text-sm text-red-500">
            ⚠️ This action cannot be undone. All product data including images will be permanently deleted.
          </p>
        </div>
      </Modal>

      {/* Floating Add Button (Mobile) */}
      <Link
        to="/admin/products/add"
        className="fixed z-50 md:hidden bottom-6 right-6"
      >
        <Button 
          type="primary" 
          shape="circle" 
          size="large"
          icon={<PlusOutlined />}
          className="shadow-lg hover:shadow-xl"
          style={{ 
            width: '56px',
            height: '56px'
          }}
        />
      </Link>
    </div>
  );
}