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
  const [formData, setFormData] = useState({}); // Store ALL form data

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
      // Update formData with images
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl]
      }));
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
    // Update formData
    setFormData(prev => ({
      ...prev,
      images: newList
    }));
  };

  // Handle form field changes to update formData in real-time
  const handleFormChange = (changedValues, allValues) => {
    setFormData(prev => ({
      ...prev,
      ...changedValues
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Basic Info
        const productName = form.getFieldValue('productName');
        const category = form.getFieldValue('category');
        return productName && productName.trim().length > 0 && category && category !== 'all';
        
      case 1: // Details
        const price = form.getFieldValue('price');
        const stock = form.getFieldValue('stock');
        const description = form.getFieldValue('description');
        return price !== undefined && price !== null && price >= 0 &&
               stock !== undefined && stock !== null && stock >= 0 &&
               description && description.trim().length > 0;
        
      default:
        return true;
    }
  };

  const next = async () => {
    try {
      // Validate current step before proceeding
      const isValid = validateCurrentStep();
      
      if (!isValid) {
        let errorMessage = "";
        switch (currentStep) {
          case 0:
            errorMessage = "Please fill in Product Name and select a Category";
            break;
          case 1:
            errorMessage = "Please fill in Price, Stock, and Description";
            break;
          default:
            errorMessage = "Please complete all required fields";
        }
        
        toast.error(errorMessage);
        return;
      }
      
      // Get all current form values
      const currentValues = form.getFieldsValue();
      console.log("Current form values before next:", currentValues);
      console.log("Current formData before update:", formData);
      
      // Update formData with all current values
      setFormData(prev => ({
        ...prev,
        ...currentValues
      }));
      
      console.log("Updated formData:", { ...formData, ...currentValues });
      
      // Move to next step
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Error in next function:", error);
      toast.error("Error processing form data");
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async (values) => {
    // Use combined data from formData and current form values
    const finalData = { ...formData, ...values };
    console.log("Final data for submission:", finalData);
    
    // Final validation
    if (!finalData.productName || !finalData.category || finalData.category === 'all') {
      toast.error("Please fill in Product Name and select a Category");
      return;
    }
    
    if (!finalData.price || finalData.price < 0 || 
        !finalData.stock || finalData.stock < 0 || 
        !finalData.description) {
      toast.error("Please fill in Price, Stock, and Description");
      return;
    }

    setLoading(true);
    try {
      // Prepare product data - productId will be generated by backend
      const productData = {
        // productId is NOT included - backend will generate it
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
        features: finalData.features || [],
        benefits: finalData.benefits || [],
        skinType: finalData.skinType || [],
        scentFamily: finalData.scentFamily || [],
        tags: finalData.tags ? finalData.tags.split(',').map(tag => tag.trim()) : []
      };

      console.log("Sending to backend:", productData);

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
          content: `Product created successfully with ID: ${response.data.product.productId}`,
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="shadow-sm">
            <Row gutter={16}>
              <Col span={24}>
                <Alert
                  message="Product ID will be auto-generated"
                  description="The system will automatically create a unique product ID for you (e.g., PRD0001, PRD0002, etc.)"
                  type="info"
                  showIcon
                  className="mb-6"
                />
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
                  rules={[{ 
                    required: true, 
                    message: 'Please select category',
                    validator: (_, value) => {
                      if (!value || value === 'all') {
                        return Promise.reject(new Error('Please select a category'));
                      }
                      return Promise.resolve();
                    }
                  }]}
                  initialValue="all"
                >
                  <Select 
                    size="large"
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, category: value }));
                    }}
                  >
                    <Option value="all" disabled>Select a category</Option>
                    {categoryOptions.filter(opt => opt.value !== 'all').map(option => (
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
                        onChange={(value) => {
                          setFormData(prev => ({ ...prev, rating: value }));
                        }}
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
                        onChange={(value) => {
                          setFormData(prev => ({ ...prev, reviewCount: value }));
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
        // Get all form data from state
        console.log("Review step - formData:", formData);
        
        return (
          <Card className="shadow-sm">
            <Alert
              message="Review Product Details"
              description="Please review all information before submitting. Product ID will be auto-generated upon submission."
              type="info"
              showIcon
              className="mb-6"
            />
            
            <Descriptions title="Product Information" bordered column={2}>
              <Descriptions.Item label="Product ID">
                <Tag color="blue">Auto-generated upon submission</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Product Name">
                {formData.productName ? (
                  <span className="font-semibold">{formData.productName}</span>
                ) : (
                  <Tag color="red">Required field not set</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Display Name">
                {formData.name || formData.productName || 'Same as Product Name'}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {formData.category && formData.category !== 'all' ? (
                  <Tag color="blue">
                    {categoryOptions.find(cat => cat.value === formData.category)?.label || formData.category}
                  </Tag>
                ) : (
                  <Tag color="red">Required field not set</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                {formData.price !== undefined && formData.price !== null ? (
                  <span className="font-semibold">${parseFloat(formData.price).toFixed(2)}</span>
                ) : (
                  <Tag color="red">Required field not set</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Original Price">
                ${formData.originalPrice || formData.price || 'Same as price'}
              </Descriptions.Item>
              <Descriptions.Item label="Stock">
                {formData.stock !== undefined && formData.stock !== null ? (
                  <span className="font-semibold">{formData.stock} units</span>
                ) : (
                  <Tag color="red">Required field not set</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Short Description">
                {formData.description ? (
                  <div className="p-2 overflow-y-auto rounded max-h-32 bg-gray-50">
                    {formData.description}
                  </div>
                ) : (
                  <Tag color="red">Required field not set</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Space>
                  {formData.isNew && <Tag color="green">NEW ARRIVAL</Tag>}
                  {formData.isBestSeller && <Tag color="red">BEST SELLER</Tag>}
                  {!formData.isNew && !formData.isBestSeller && <Tag>Regular</Tag>}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Rating">
                {formData.rating || '0'} / 5.0
              </Descriptions.Item>
              <Descriptions.Item label="Review Count">
                {formData.reviewCount || '0'} reviews
              </Descriptions.Item>
              <Descriptions.Item label="Images" span={2}>
                {imageList.length > 0 ? (
                  <div>
                    <Tag color="blue">{imageList.length} image(s) uploaded</Tag>
                    <div className="mt-2">
                      {imageList.slice(0, 3).map((img, index) => (
                        <img 
                          key={index} 
                          src={img} 
                          alt={`Preview ${index + 1}`} 
                          className="inline-block object-cover w-16 h-16 mr-2 rounded"
                        />
                      ))}
                      {imageList.length > 3 && (
                        <Tag className="ml-2">+{imageList.length - 3} more</Tag>
                      )}
                    </div>
                  </div>
                ) : (
                  <Tag color="orange">No images uploaded</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Detailed Description" span={2}>
                {formData.detailedDescription ? (
                  <div className="p-2 overflow-y-auto rounded max-h-32 bg-gray-50">
                    {formData.detailedDescription}
                  </div>
                ) : (
                  <Tag>No detailed description</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Tags" span={2}>
                {formData.tags ? (
                  <div>
                    {formData.tags.split(',').map((tag, index) => (
                      <Tag key={index} color="purple" className="mb-1 mr-1">
                        {tag.trim()}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <Tag>No tags</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Features" span={2}>
                {formData.features?.length > 0 ? (
                  <ul className="pl-5 list-disc">
                    {formData.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <Tag>No features</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Benefits" span={2}>
                {formData.benefits?.length > 0 ? (
                  <div>
                    {formData.benefits.map((benefit, index) => (
                      <Tag key={index} color="green" className="mb-1 mr-1">
                        {benefitsOptions.find(b => b.value === benefit)?.label || benefit}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <Tag>No benefits specified</Tag>
                )}
              </Descriptions.Item>
              {formData.category === 'skincare' && formData.skinType?.length > 0 && (
                <Descriptions.Item label="Suitable Skin Types" span={2}>
                  <div>
                    {formData.skinType.map((type, index) => (
                      <Tag key={index} color="cyan" className="mb-1 mr-1">
                        {skinTypeOptions.find(st => st.value === type)?.label || type}
                      </Tag>
                    ))}
                  </div>
                </Descriptions.Item>
              )}
              {formData.category === 'perfumes' && formData.scentFamily?.length > 0 && (
                <Descriptions.Item label="Scent Family" span={2}>
                  <div>
                    {formData.scentFamily.map((scent, index) => (
                      <Tag key={index} color="magenta" className="mb-1 mr-1">
                        {scentFamilyOptions.find(sf => sf.value === scent)?.label || scent}
                      </Tag>
                    ))}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
            
            {/* Validation Summary */}
            {(!formData.productName || !formData.category || formData.category === 'all' || 
              !formData.price || !formData.stock || !formData.description) && (
              <Alert
                message="Missing Required Fields"
                description="Please go back and fill in all required fields (marked in red above)"
                type="error"
                showIcon
                className="mt-4"
              />
            )}
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
                onClick={() => {
                  // Use formData for validation
                  if (!formData.productName || !formData.category || formData.category === 'all') {
                    toast.error("Please fill in Product Name and select a Category");
                    return;
                  }
                  if (!formData.price || formData.price < 0 || 
                      !formData.stock || formData.stock < 0 || 
                      !formData.description) {
                    toast.error("Please fill in Price, Stock, and Description");
                    return;
                  }
                  // Submit the form with current formData
                  onFinish(formData);
                }}
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
        onValuesChange={handleFormChange}
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
              <Button 
                type="primary" 
                onClick={next} 
                size="large"
              >
                Next
              </Button>
            )}
          </Space>
        </div>
      </Form>
    </div>
  );
}