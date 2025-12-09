import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Card,
  Row,
  Col,
  Upload,
  Switch,
  Tag,
  Space,
  Divider,
  Alert,
  Spin,
  Steps,
  Descriptions,
  Modal,
  Image
} from "antd";
import {
  ArrowLeftOutlined,
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined
} from "@ant-design/icons";

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

export default function EditProductForm() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [imageList, setImageList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [product, setProduct] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [categories, setCategories] = useState([]);

  // If product is passed via state (from admin product page)
  const productFromState = location.state?.product;

  useEffect(() => {
    if (productFromState) {
      // Use product from state if available
      loadProductData(productFromState);
      setLoadingProduct(false);
    } else if (productId) {
      // Otherwise fetch from API
      fetchProduct();
    } else {
      toast.error("No product selected");
      navigate("/admin/products");
    }
    fetchCategories();
  }, [productId, productFromState]);

  const fetchProduct = async () => {
    setLoadingProduct(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`
      );
      
      if (response.data.product) {
        loadProductData(response.data.product);
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      navigate("/admin/products");
    } finally {
      setLoadingProduct(false);
    }
  };

  const loadProductData = (productData) => {
    setProduct(productData);
    
    // Set form values
    form.setFieldsValue({
      productName: productData.productName || productData.name,
      name: productData.name || productData.productName,
      category: productData.category || 'all',
      price: productData.price,
      originalPrice: productData.originalPrice,
      lastPrice: productData.lastPrice || productData.price,
      stock: productData.stock || 0,
      description: productData.description || '',
      detailedDescription: productData.detailedDescription || '',
      rating: productData.rating || 0,
      reviewCount: productData.reviewCount || 0,
      isNew: productData.isNew || false,
      isBestSeller: productData.isBestSeller || false,
      altNames: productData.altNames ? productData.altNames.join(', ') : '',
      features: productData.features || [''],
      benefits: productData.benefits || [],
      skinType: productData.skinType || [],
      scentFamily: productData.scentFamily || [],
      tags: productData.tags ? productData.tags.join(', ') : '',
    });
    
    // Set images
    setImageList(productData.images || []);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/categories`);
      if (response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const steps = [
    {
      title: 'Basic Info',
      content: 'Edit basic product information',
    },
    {
      title: 'Details',
      content: 'Update product details and description',
    },
    {
      title: 'Media',
      content: 'Manage product images',
    },
    {
      title: 'Attributes',
      content: 'Update product attributes',
    },
    {
      title: 'Review',
      content: 'Review and save changes',
    },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'perfumes', label: 'Perfumes' },
    { value: 'skincare', label: 'Skincare' },
    { value: 'makeup', label: 'Makeup' },
    { value: 'tools', label: 'Tools' }
  ];

  const benefitsOptions = [
    { value: 'hydrating', label: 'Hydrating' },
    { value: 'anti-aging', label: 'Anti-Aging' },
    { value: 'brightening', label: 'Brightening' },
    { value: 'soothing', label: 'Soothing' },
    { value: 'calming', label: 'Calming' },
    { value: 'energizing', label: 'Energizing' }
  ];

  const skinTypeOptions = [
    { value: 'dry', label: 'Dry' },
    { value: 'oily', label: 'Oily' },
    { value: 'combination', label: 'Combination' },
    { value: 'sensitive', label: 'Sensitive' },
    { value: 'normal', label: 'Normal' }
  ];

  const scentFamilyOptions = [
    { value: 'woody', label: 'Woody' },
    { value: 'floral', label: 'Floral' },
    { value: 'oriental', label: 'Oriental' },
    { value: 'fresh', label: 'Fresh' },
    { value: 'spicy', label: 'Spicy' }
  ];

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      // If you have an uploadMediaToSupabase function
      // const imageUrl = await uploadMediaToSupabase(file);
      // For now, we'll use a placeholder
      const imageUrl = URL.createObjectURL(file);
      setImageList(prev => [...prev, imageUrl]);
      return false;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      return false;
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newList = [...imageList];
    newList.splice(index, 1);
    setImageList(newList);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Prepare update data
      const updateData = {
        productName: values.productName,
        name: values.name || values.productName,
        category: values.category,
        price: values.price,
        originalPrice: values.originalPrice,
        lastPrice: values.lastPrice || values.price,
        stock: values.stock,
        description: values.description,
        detailedDescription: values.detailedDescription,
        rating: values.rating || 0,
        reviewCount: values.reviewCount || 0,
        isNew: values.isNew || false,
        isBestSeller: values.isBestSeller || false,
        images: imageList,
        altNames: values.altNames ? values.altNames.split(',').map(name => name.trim()) : [],
        features: (values.features || []).filter(feature => feature.trim() !== ''),
        benefits: values.benefits || [],
        skinType: values.skinType || [],
        scentFamily: values.scentFamily || [],
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : []
      };

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === "Product updated successfully") {
        toast.success('Product updated successfully!');
        
        Modal.success({
          title: 'Success!',
          content: 'Product has been updated successfully.',
          onOk: () => navigate('/admin/products'),
          okText: 'View Products'
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Update product error:", error);
      
      let errorMessage = "Failed to update product";
      if (error.response?.status === 403) {
        errorMessage = "Please login as administrator to update products";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      Modal.error({
        title: 'Error',
        content: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    if (loadingProduct) {
      return (
        <div className="flex items-center justify-center h-64">
          <Spin size="large" tip="Loading product data..." />
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <Card className="shadow-sm">
            <div className="mb-6">
              <Alert
                message="Editing Product"
                description={`Product ID: ${product?.productId}`}
                type="info"
                showIcon
              />
            </div>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Product Name"
                  name="productName"
                  rules={[{ required: true, message: 'Please enter product name' }]}
                >
                  <Input 
                    placeholder="Enter product name" 
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  label="Display Name"
                  name="name"
                >
                  <Input 
                    placeholder="Optional display name" 
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[{ required: true, message: 'Please select category' }]}
                >
                  <Select size="large">
                    {categoryOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );
        
      case 1:
        return (
          <Card className="shadow-sm">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Price ($)"
                  name="price"
                  rules={[
                    { required: true, message: 'Please enter price' },
                    { type: 'number', min: 0, message: 'Price must be positive' }
                  ]}
                >
                  <InputNumber 
                    style={{ width: '100%' }}
                    size="large"
                    min={0}
                    step={0.01}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  label="Original Price ($)"
                  name="originalPrice"
                >
                  <InputNumber 
                    style={{ width: '100%' }}
                    size="large"
                    min={0}
                    step={0.01}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  label="Last Price ($)"
                  name="lastPrice"
                >
                  <InputNumber 
                    style={{ width: '100%' }}
                    size="large"
                    min={0}
                    step={0.01}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  label="Stock"
                  name="stock"
                  rules={[
                    { required: true, message: 'Please enter stock quantity' },
                    { type: 'number', min: 0, message: 'Stock cannot be negative' }
                  ]}
                >
                  <InputNumber 
                    style={{ width: '100%' }}
                    size="large"
                    min={0}
                  />
                </Form.Item>
              </Col>
              
              <Col span={24}>
                <Form.Item
                  label="Short Description"
                  name="description"
                  rules={[{ required: true, message: 'Please enter description' }]}
                >
                  <TextArea 
                    rows={3}
                    placeholder="Brief description for product cards"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col span={24}>
                <Form.Item
                  label="Detailed Description"
                  name="detailedDescription"
                >
                  <TextArea 
                    rows={6}
                    placeholder="Full product description for detail page"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );
        
      case 2:
        return (
          <Card className="shadow-sm">
            <div className="mb-6">
              <Alert
                message="Product Images"
                description="Manage product images. First image is used as thumbnail."
                type="info"
                showIcon
              />
            </div>
            
            <div className="mb-6">
              <h4 className="mb-3 font-medium">Current Images</h4>
              {imageList.length === 0 ? (
                <Alert message="No images uploaded" type="warning" showIcon />
              ) : (
                <Row gutter={[16, 16]}>
                  {imageList.map((url, index) => (
                    <Col key={index} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        size="small"
                        cover={
                          <div className="h-32 overflow-hidden">
                            <img
                              alt={`Product image ${index + 1}`}
                              src={url}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        }
                        actions={[
                          <EyeOutlined 
                            key="view" 
                            onClick={() => window.open(url, '_blank')}
                          />,
                          <DeleteOutlined 
                            key="delete" 
                            onClick={() => removeImage(index)}
                            className="text-red-500"
                          />
                        ]}
                      >
                        <p className="text-xs text-center text-gray-500">
                          Image {index + 1}
                        </p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
            
            <Form.Item
              label="Add More Images"
            >
              <Upload
                listType="picture-card"
                customRequest={({ file }) => handleImageUpload(file)}
                multiple
                accept="image/*"
                showUploadList={false}
              >
                <div>
                  {uploading ? <Spin /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>
                    {uploading ? 'Uploading...' : 'Upload'}
                  </div>
                </div>
              </Upload>
            </Form.Item>
          </Card>
        );
        
      case 3:
        const category = form.getFieldValue('category');
        
        return (
          <Card className="shadow-sm">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Benefits"
                  name="benefits"
                >
                  <Select
                    mode="multiple"
                    placeholder="Select benefits"
                    size="large"
                  >
                    {benefitsOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              
              {category === 'skincare' && (
                <Col span={24}>
                  <Form.Item
                    label="Skin Type"
                    name="skinType"
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select suitable skin types"
                      size="large"
                    >
                      {skinTypeOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              
              {category === 'perfumes' && (
                <Col span={24}>
                  <Form.Item
                    label="Scent Family"
                    name="scentFamily"
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select scent families"
                      size="large"
                    >
                      {scentFamilyOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              
              <Col span={24}>
                <Divider orientation="left">Product Flags</Divider>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Mark as New Arrival"
                      name="isNew"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Mark as Best Seller"
                      name="isBestSeller"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        );
        
      case 4:
        const formValues = form.getFieldsValue();
        
        return (
          <Card className="shadow-sm">
            <Alert
              message="Review Changes"
              description="Please review all changes before saving."
              type="info"
              showIcon
              className="mb-6"
            />
            
            <Descriptions title="Product Information" bordered column={2}>
              <Descriptions.Item label="Product ID">{product?.productId}</Descriptions.Item>
              <Descriptions.Item label="Product Name">{formValues.productName}</Descriptions.Item>
              <Descriptions.Item label="Category">{formValues.category}</Descriptions.Item>
              <Descriptions.Item label="Display Name">{formValues.name || 'Not set'}</Descriptions.Item>
              <Descriptions.Item label="Price">${formValues.price}</Descriptions.Item>
              <Descriptions.Item label="Original Price">${formValues.originalPrice || 'Same as price'}</Descriptions.Item>
              <Descriptions.Item label="Stock">{formValues.stock}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Space>
                  {formValues.isNew && <Tag color="green">NEW</Tag>}
                  {formValues.isBestSeller && <Tag color="red">BEST SELLER</Tag>}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Images" span={2}>
                {imageList.length} image(s)
              </Descriptions.Item>
            </Descriptions>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/products')}
          className="mb-4"
        >
          Back to Products
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
            <p className="text-gray-500">Update product: {product?.productName}</p>
          </div>
          
          <Space>
            <Button 
              onClick={() => navigate('/admin/products')}
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
            {currentStep === steps.length - 1 && (
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                onClick={() => form.submit()}
                loading={loading}
                size="large"
              >
                Save Changes
              </Button>
            )}
          </Space>
        </div>
      </div>

      {/* Steps */}
      <Card className="mb-6 shadow-sm">
        <Steps current={currentStep}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} description={item.content} />
          ))}
        </Steps>
      </Card>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          category: 'all',
          stock: 0,
          rating: 0,
          reviewCount: 0,
          isNew: false,
          isBestSeller: false,
          features: ['']
        }}
      >
        {renderStepContent()}
        
        {/* Navigation Buttons */}
        <div className="mt-6 text-right">
          <Space>
            {currentStep > 0 && (
              <Button onClick={() => prev()} size="large">
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => next()} size="large">
                Next
              </Button>
            )}
          </Space>
        </div>
      </Form>
    </div>
  );
}