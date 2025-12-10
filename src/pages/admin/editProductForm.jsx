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
import uploadMediaToSupabase from "../../utils/mediaUpload";

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
  const [formData, setFormData] = useState({}); // Store form data

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
    
    // Convert arrays to comma-separated strings for form
    const formattedData = {
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
      features: productData.features || [],
      benefits: productData.benefits || [],
      skinType: productData.skinType || [],
      scentFamily: productData.scentFamily || [],
      tags: productData.tags ? productData.tags.join(', ') : '',
    };
    
    // Set form values
    form.setFieldsValue(formattedData);
    
    // Update formData state
    setFormData(formattedData);
    
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
      const imageUrl = await uploadMediaToSupabase(file);
      setImageList(prev => [...prev, imageUrl]);
      return false; // Prevent default upload
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

  // Handle form field changes
  const handleFormChange = (changedValues, allValues) => {
    setFormData(prev => ({
      ...prev,
      ...changedValues
    }));
  };

  const next = () => {
    // Collect current form data before moving to next step
    const currentValues = form.getFieldsValue();
    setFormData(prev => ({ ...prev, ...currentValues }));
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Combine formData with current form values
      const finalData = { ...formData, ...values };
      
      // Prepare update data - ensure proper format
      const updateData = {
        productName: finalData.productName,
        name: finalData.name || finalData.productName,
        category: finalData.category,
        price: finalData.price,
        originalPrice: finalData.originalPrice,
        lastPrice: finalData.lastPrice || finalData.price,
        stock: finalData.stock,
        description: finalData.description,
        detailedDescription: finalData.detailedDescription,
        rating: finalData.rating || 0,
        reviewCount: finalData.reviewCount || 0,
        isNew: finalData.isNew || false,
        isBestSeller: finalData.isBestSeller || false,
        images: imageList,
        altNames: finalData.altNames ? finalData.altNames.split(',').map(name => name.trim()) : [],
        features: (finalData.features || []).filter(feature => feature && feature.trim() !== ''),
        benefits: finalData.benefits || [],
        skinType: finalData.skinType || [],
        scentFamily: finalData.scentFamily || [],
        tags: finalData.tags ? finalData.tags.split(',').map(tag => tag.trim()) : []
      };

      console.log("Update data being sent:", updateData);

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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, productName: e.target.value }));
                    }}
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                    }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[{ required: true, message: 'Please select category' }]}
                >
                  <Select 
                    size="large"
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, category: value }));
                    }}
                  >
                    {categoryOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, altNames: e.target.value }));
                    }}
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, tags: e.target.value }));
                    }}
                  />
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
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, price: value }));
                    }}
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
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, originalPrice: value }));
                    }}
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
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, lastPrice: value }));
                    }}
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
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, stock: value }));
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="Rating"
                  name="rating"
                >
                  <InputNumber 
                    style={{ width: '100%' }}
                    size="large"
                    min={0}
                    max={5}
                    step={0.1}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, rating: value }));
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="Review Count"
                  name="reviewCount"
                >
                  <InputNumber 
                    style={{ width: '100%' }}
                    size="large"
                    min={0}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, reviewCount: value }));
                    }}
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, description: e.target.value }));
                    }}
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, detailedDescription: e.target.value }));
                    }}
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

            <Form.List name="features">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  <Divider orientation="left">Features</Divider>
                  {fields.map((field, index) => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...field}
                        rules={[{ required: false, message: 'Feature is required' }]}
                      >
                        <Input 
                          placeholder={`Feature ${index + 1}`} 
                          onChange={(e) => {
                            const newFeatures = [...(formData.features || [])];
                            newFeatures[index] = e.target.value;
                            setFormData(prev => ({ ...prev, features: newFeatures }));
                          }}
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => {
                        const newFeatures = (formData.features || []).filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, features: newFeatures }));
                        remove(field.name);
                      }} />
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
        const category = formData.category || form.getFieldValue('category');
        
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
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, benefits: value }));
                    }}
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
                      onChange={(value) => {
                        setFormData(prev => ({ ...prev, skinType: value }));
                      }}
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
                      onChange={(value) => {
                        setFormData(prev => ({ ...prev, scentFamily: value }));
                      }}
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
                      <Switch 
                        onChange={(checked) => {
                          setFormData(prev => ({ ...prev, isNew: checked }));
                        }}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Mark as Best Seller"
                      name="isBestSeller"
                      valuePropName="checked"
                    >
                      <Switch 
                        onChange={(checked) => {
                          setFormData(prev => ({ ...prev, isBestSeller: checked }));
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        );
        
      case 4:
        // Combine formData with any new changes
        const currentValues = form.getFieldsValue();
        const reviewData = { ...formData, ...currentValues };
        
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
              <Descriptions.Item label="Product Name">
                {reviewData.productName || <Tag color="red">Not set</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {reviewData.category || <Tag color="red">Not set</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Display Name">
                {reviewData.name || reviewData.productName || 'Same as Product Name'}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                ${reviewData.price || <Tag color="red">Not set</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Original Price">
                ${reviewData.originalPrice || reviewData.price || 'Same as price'}
              </Descriptions.Item>
              <Descriptions.Item label="Stock">
                {reviewData.stock || <Tag color="red">Not set</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Short Description">
                {reviewData.description ? (
                  <div className="p-1 overflow-y-auto max-h-20">
                    {reviewData.description}
                  </div>
                ) : (
                  <Tag color="red">Not set</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Space>
                  {reviewData.isNew && <Tag color="green">NEW</Tag>}
                  {reviewData.isBestSeller && <Tag color="red">BEST SELLER</Tag>}
                  {!reviewData.isNew && !reviewData.isBestSeller && <Tag>Regular</Tag>}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Rating">
                {reviewData.rating || '0'} / 5.0
              </Descriptions.Item>
              <Descriptions.Item label="Review Count">
                {reviewData.reviewCount || '0'}
              </Descriptions.Item>
              <Descriptions.Item label="Images" span={2}>
                {imageList.length > 0 ? (
                  <div>
                    <Tag color="blue">{imageList.length} image(s)</Tag>
                    <div className="mt-2">
                      {imageList.slice(0, 3).map((img, index) => (
                        <img 
                          key={index} 
                          src={img} 
                          alt={`Preview ${index + 1}`} 
                          className="inline-block object-cover w-12 h-12 mr-2 rounded"
                        />
                      ))}
                      {imageList.length > 3 && (
                        <Tag className="ml-2">+{imageList.length - 3} more</Tag>
                      )}
                    </div>
                  </div>
                ) : (
                  <Tag color="orange">No images</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Features" span={2}>
                {reviewData.features?.length > 0 ? (
                  <ul className="pl-5 list-disc">
                    {reviewData.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <Tag>No features</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Benefits" span={2}>
                {reviewData.benefits?.length > 0 ? (
                  <div>
                    {reviewData.benefits.map((benefit, index) => (
                      <Tag key={index} color="green" className="mb-1 mr-1">
                        {benefit}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <Tag>No benefits</Tag>
                )}
              </Descriptions.Item>
              {reviewData.skinType?.length > 0 && (
                <Descriptions.Item label="Skin Types" span={2}>
                  <div>
                    {reviewData.skinType.map((type, index) => (
                      <Tag key={index} color="cyan" className="mb-1 mr-1">
                        {type}
                      </Tag>
                    ))}
                  </div>
                </Descriptions.Item>
              )}
              {reviewData.scentFamily?.length > 0 && (
                <Descriptions.Item label="Scent Family" span={2}>
                  <div>
                    {reviewData.scentFamily.map((scent, index) => (
                      <Tag key={index} color="magenta" className="mb-1 mr-1">
                        {scent}
                      </Tag>
                    ))}
                  </div>
                </Descriptions.Item>
              )}
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
        onValuesChange={handleFormChange}
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