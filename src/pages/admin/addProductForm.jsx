import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Modal
} from "antd";
import {
  ArrowLeftOutlined,
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  CloseOutlined
} from "@ant-design/icons";
import uploadMediaToSupabase from "../../utils/mediaUpload";
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

export default function AddProductForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [imageList, setImageList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      content: 'Enter basic product information',
    },
    {
      title: 'Details',
      content: 'Add product details and description',
    },
    {
      title: 'Media',
      content: 'Upload product images',
    },
    {
      title: 'Attributes',
      content: 'Set product attributes and flags',
    },
    {
      title: 'Review',
      content: 'Review and submit',
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
      const imageUrl = await uploadMediaToSupabase(file);
      setImageList(prev => [...prev, imageUrl]);
      form.setFieldValue('images', [...(form.getFieldValue('images') || []), imageUrl]);
      return false; // Prevent default upload
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      return false;
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageUrl) => {
    const newList = imageList.filter(img => img !== imageUrl);
    setImageList(newList);
    form.setFieldValue('images', newList);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Prepare product data
      const productData = {
        productId: values.productId,
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
        features: values.features || [],
        benefits: values.benefits || [],
        skinType: values.skinType || [],
        scentFamily: values.scentFamily || [],
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : []
      };

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === "Product created successfully") {
        toast.success('Product created successfully!');
        
        // Show success modal
        Modal.success({
          title: 'Success!',
          content: 'Product has been created successfully.',
          onOk: () => navigate('/admin/products'),
          okText: 'View Products'
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Create product error:", error);
      
      let errorMessage = "Failed to create product";
      if (error.response?.status === 403) {
        errorMessage = "Please login as administrator to add products";
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
    switch (currentStep) {
      case 0:
        return (
          <Card className="shadow-sm">
            <Row gutter={16}>
              <Col span={24}>
                <Alert
                  message="Product ID must be unique"
                  description="This will be used as the primary identifier for the product"
                  type="info"
                  showIcon
                  className="mb-6"
                />
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  label="Product ID"
                  name="productId"
                  rules={[
                    { required: true, message: 'Please enter product ID' },
                    { pattern: /^[a-zA-Z0-9-_]+$/, message: 'Only letters, numbers, dash and underscore allowed' }
                  ]}
                >
                  <Input 
                    placeholder="e.g., PROD-001" 
                    size="large"
                  />
                </Form.Item>
              </Col>
              
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
                  initialValue="all"
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
              
              <Col span={24}>
                <Form.Item
                  label="Tags"
                  name="tags"
                >
                  <Input 
                    placeholder="e.g., premium, natural, luxury (comma separated)"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col span={24}>
                <Form.Item
                  label="Alternative Names"
                  name="altNames"
                >
                  <Input 
                    placeholder="e.g., Alternative 1, Alternative 2 (comma separated)"
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
                message="Upload Product Images"
                description="Upload high-quality images for your product. First image will be used as thumbnail."
                type="info"
                showIcon
              />
            </div>
            
            <Form.Item
              name="images"
              label="Product Images"
            >
              <div className="space-y-4">
                <Upload
                  listType="picture-card"
                  fileList={imageList.map((url, index) => ({
                    uid: index,
                    name: `image-${index}.jpg`,
                    status: 'done',
                    url: url,
                  }))}
                  onRemove={(file) => removeImage(file.url)}
                  customRequest={({ file }) => handleImageUpload(file)}
                  multiple
                  accept="image/*"
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                    showDownloadIcon: false,
                  }}
                >
                  {imageList.length >= 8 ? null : (
                    <div>
                      {uploading ? <Spin /> : <UploadOutlined />}
                      <div style={{ marginTop: 8 }}>
                        {uploading ? 'Uploading...' : 'Upload'}
                      </div>
                    </div>
                  )}
                </Upload>
                
                {imageList.length === 0 && (
                  <Alert
                    message="No images uploaded"
                    description="At least one image is recommended for better product presentation."
                    type="warning"
                    showIcon
                  />
                )}
              </div>
            </Form.Item>
            
            <Form.List name="features">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  <Divider orientation="left">Features</Divider>
                  {fields.map((field, index) => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...field}
                        rules={[{ required: true, message: 'Feature is required' }]}
                      >
                        <Input placeholder={`Feature ${index + 1}`} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Feature
                  </Button>
                </div>
              )}
            </Form.List>
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
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Initial Rating"
                      name="rating"
                      initialValue={0}
                    >
                      <InputNumber
                        min={0}
                        max={5}
                        step={0.1}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Review Count"
                      name="reviewCount"
                      initialValue={0}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                      />
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
              message="Review Product Details"
              description="Please review all information before submitting."
              type="info"
              showIcon
              className="mb-6"
            />
            
            <Descriptions title="Product Information" bordered column={2}>
              <Descriptions.Item label="Product ID">{formValues.productId}</Descriptions.Item>
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
                {imageList.length} image(s) uploaded
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {formValues.description || 'No description'}
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
            <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
            <p className="text-gray-500">Create a new product for your store</p>
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
                Create Product
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
          isBestSeller: false
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