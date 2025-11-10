'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CopyIcon,
  EyeIcon,
  DownloadIcon,
  UploadIcon,
  PaletteIcon,
  ImageIcon,
  LayoutTemplateIcon,
  SettingsIcon,
  SaveIcon,
  XIcon,
  CheckIcon,
  StarIcon,
  ClockIcon,
  FileTextIcon,
  TypeIcon
} from 'lucide-react';

// Mock data for invoice templates
const mockTemplates = [
  {
    id: 'TPL-001',
    name: 'Standard Medical Invoice',
    description: 'Professional medical services invoice template',
    category: 'Medical',
    isDefault: true,
    isActive: true,
    usageCount: 145,
    lastUsed: '2024-11-06',
    thumbnail: '/api/placeholder/300/200',
    layout: 'standard',
    headerColor: '#2563eb',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fields: [
      { id: 'patientInfo', label: 'Patient Information', type: 'section', required: true, visible: true },
      { id: 'serviceDate', label: 'Service Date', type: 'date', required: true, visible: true },
      { id: 'provider', label: 'Provider Name', type: 'text', required: true, visible: true },
      { id: 'diagnosis', label: 'Diagnosis Code', type: 'text', required: false, visible: true },
      { id: 'referralNumber', label: 'Referral Number', type: 'text', required: false, visible: false }
    ]
  },
  {
    id: 'TPL-002',
    name: 'Emergency Department',
    description: 'Template for emergency department visits and urgent care',
    category: 'Emergency',
    isDefault: false,
    isActive: true,
    usageCount: 89,
    lastUsed: '2024-11-05',
    thumbnail: '/api/placeholder/300/200',
    layout: 'compact',
    headerColor: '#dc2626',
    accentColor: '#ef4444',
    fontFamily: 'Inter',
    fields: [
      { id: 'patientInfo', label: 'Patient Information', type: 'section', required: true, visible: true },
      { id: 'emergencyContact', label: 'Emergency Contact', type: 'section', required: true, visible: true },
      { id: 'admissionTime', label: 'Admission Time', type: 'datetime', required: true, visible: true },
      { id: 'dischargeTime', label: 'Discharge Time', type: 'datetime', required: true, visible: true },
      { id: 'acuity', label: 'Acuity Level', type: 'select', required: true, visible: true }
    ]
  },
  {
    id: 'TPL-003',
    name: 'Physical Therapy',
    description: 'Specialized template for physical therapy sessions',
    category: 'Therapy',
    isDefault: false,
    isActive: true,
    usageCount: 67,
    lastUsed: '2024-11-04',
    thumbnail: '/api/placeholder/300/200',
    layout: 'detailed',
    headerColor: '#059669',
    accentColor: '#10b981',
    fontFamily: 'Inter',
    fields: [
      { id: 'patientInfo', label: 'Patient Information', type: 'section', required: true, visible: true },
      { id: 'sessionType', label: 'Session Type', type: 'select', required: true, visible: true },
      { id: 'therapist', label: 'Therapist Name', type: 'text', required: true, visible: true },
      { id: 'exercisesPrescribed', label: 'Exercises Prescribed', type: 'textarea', required: false, visible: true },
      { id: 'nextAppointment', label: 'Next Appointment', type: 'date', required: false, visible: true }
    ]
  },
  {
    id: 'TPL-004',
    name: 'Laboratory Services',
    description: 'Template for lab work and diagnostic testing',
    category: 'Laboratory',
    isDefault: false,
    isActive: true,
    usageCount: 123,
    lastUsed: '2024-11-03',
    thumbnail: '/api/placeholder/300/200',
    layout: 'standard',
    headerColor: '#7c3aed',
    accentColor: '#8b5cf6',
    fontFamily: 'Inter',
    fields: [
      { id: 'patientInfo', label: 'Patient Information', type: 'section', required: true, visible: true },
      { id: 'orderingPhysician', label: 'Ordering Physician', type: 'text', required: true, visible: true },
      { id: 'specimenType', label: 'Specimen Type', type: 'select', required: true, visible: true },
      { id: 'collectionDate', label: 'Collection Date', type: 'date', required: true, visible: true },
      { id: 'resultsDate', label: 'Results Date', type: 'date', required: false, visible: true }
    ]
  }
];

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'datetime' | 'select' | 'number' | 'section';
  required: boolean;
  visible: boolean;
  options?: string[];
}

interface TemplateFormData {
  name: string;
  description: string;
  category: string;
  layout: 'standard' | 'compact' | 'detailed';
  headerColor: string;
  accentColor: string;
  fontFamily: string;
  logo: string;
  fields: CustomField[];
}

export default function InvoiceTemplates() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    category: 'Medical',
    layout: 'standard',
    headerColor: '#2563eb',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    logo: '',
    fields: [
      { id: 'patientInfo', label: 'Patient Information', type: 'section', required: true, visible: true }
    ]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ['All', 'Medical', 'Emergency', 'Therapy', 'Laboratory', 'Surgery', 'Dental'];
  const layouts = [
    { value: 'standard', label: 'Standard Layout', description: 'Traditional invoice format with header and line items' },
    { value: 'compact', label: 'Compact Layout', description: 'Space-efficient design for simple invoices' },
    { value: 'detailed', label: 'Detailed Layout', description: 'Comprehensive format with additional fields and sections' }
  ];
  const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Template description is required';
    }
    if (formData.fields.length === 0) {
      newErrors.fields = 'At least one field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveTemplate = () => {
    if (!validateForm()) return;

    const newTemplate = {
      id: editingTemplate ? editingTemplate.id : `TPL-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      isDefault: false,
      isActive: true,
      usageCount: editingTemplate ? editingTemplate.usageCount : 0,
      lastUsed: editingTemplate ? editingTemplate.lastUsed : new Date().toISOString().split('T')[0],
      thumbnail: '/api/placeholder/300/200',
      layout: formData.layout,
      headerColor: formData.headerColor,
      accentColor: formData.accentColor,
      fontFamily: formData.fontFamily,
      fields: formData.fields
    };

    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? newTemplate : t));
    } else {
      setTemplates(prev => [...prev, newTemplate]);
    }

    resetForm();
    alert(`Template ${editingTemplate ? 'updated' : 'created'} successfully!`);
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingTemplate(null);
    setFormData({
      name: '',
      description: '',
      category: 'Medical',
      layout: 'standard',
      headerColor: '#2563eb',
      accentColor: '#3b82f6',
      fontFamily: 'Inter',
      logo: '',
      fields: [
        { id: 'patientInfo', label: 'Patient Information', type: 'section', required: true, visible: true }
      ]
    });
    setErrors({});
  };

  const editTemplate = (template: any) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      layout: template.layout,
      headerColor: template.headerColor,
      accentColor: template.accentColor,
      fontFamily: template.fontFamily,
      logo: template.logo || '',
      fields: template.fields
    });
    setShowCreateForm(true);
  };

  const duplicateTemplate = (template: any) => {
    const newTemplate = {
      ...template,
      id: `TPL-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isDefault: false,
      usageCount: 0,
      lastUsed: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const deleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isDefault) {
      alert('Default templates cannot be deleted.');
      return;
    }
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  const toggleTemplateStatus = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const addCustomField = () => {
    const newField: CustomField = {
      id: `field-${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      visible: true
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (index: number, updates: Partial<CustomField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) => 
        i === index ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (index: number) => {
    if (formData.fields.length <= 1) {
      alert('Template must have at least one field.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={resetForm}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ArrowLeftIcon className="h-6 w-6" />
                  </button>
                  <div className="flex items-center space-x-3">
                    <LayoutTemplateIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {editingTemplate ? 'Edit' : 'Create'} Invoice Template
                      </h1>
                      <p className="text-sm text-gray-600">Customize invoice layout and branding</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={resetForm}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveTemplate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <SaveIcon className="h-4 w-4" />
                    <span>{editingTemplate ? 'Update' : 'Create'} Template</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Template Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Template Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Cardiology Invoice"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                      {categories.filter(c => c !== 'All').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of when to use this template..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>

              {/* Layout & Design */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Design & Layout</h3>
                
                {/* Layout Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Layout Style
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {layouts.map(layout => (
                      <div
                        key={layout.value}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                          formData.layout === layout.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, layout: layout.value as any }))}
                      >
                        <h4 className="font-medium text-gray-900 mb-1">{layout.label}</h4>
                        <p className="text-sm text-gray-600">{layout.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        value={formData.headerColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, headerColor: e.target.value }))}
                      />
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.headerColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, headerColor: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accent Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        value={formData.accentColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      />
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.accentColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Family
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.fontFamily}
                      onChange={(e) => setFormData(prev => ({ ...prev, fontFamily: e.target.value }))}
                    >
                      {fonts.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Upload your company logo</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto">
                      <UploadIcon className="h-4 w-4" />
                      <span>Choose File</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Custom Fields</h3>
                  <button
                    onClick={addCustomField}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Field</span>
                  </button>
                </div>

                {errors.fields && <p className="text-red-500 text-sm mb-4">{errors.fields}</p>}

                <div className="space-y-4">
                  {formData.fields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Field Label
                          </label>
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Field Type
                          </label>
                          <select
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            value={field.type}
                            onChange={(e) => updateField(index, { type: e.target.value as any })}
                          >
                            <option value="text">Text</option>
                            <option value="textarea">Text Area</option>
                            <option value="date">Date</option>
                            <option value="datetime">Date & Time</option>
                            <option value="select">Dropdown</option>
                            <option value="number">Number</option>
                            <option value="section">Section Header</option>
                          </select>
                        </div>

                        <div className="flex items-center space-x-4 pt-6">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={field.required}
                              onChange={(e) => updateField(index, { required: e.target.checked })}
                            />
                            <span className="ml-2 text-xs text-gray-700">Required</span>
                          </label>

                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={field.visible}
                              onChange={(e) => updateField(index, { visible: e.target.checked })}
                            />
                            <span className="ml-2 text-xs text-gray-700">Visible</span>
                          </label>
                        </div>

                        <div className="flex justify-end pt-5">
                          <button
                            onClick={() => removeField(index)}
                            className="text-red-600 hover:text-red-800"
                            disabled={formData.fields.length <= 1}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {field.type === 'select' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Options (one per line)
                          </label>
                          <textarea
                            rows={3}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                            value={field.options?.join('\n') || ''}
                            onChange={(e) => updateField(index, { 
                              options: e.target.value.split('\n').filter(opt => opt.trim()) 
                            })}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Preview</h3>
                
                {/* Mini Preview */}
                <div 
                  className="border rounded-lg p-4 mb-4 min-h-64"
                  style={{ 
                    borderTopColor: formData.headerColor,
                    borderTopWidth: '4px',
                    fontFamily: formData.fontFamily 
                  }}
                >
                  <div 
                    className="text-white text-center py-2 px-4 rounded mb-4"
                    style={{ backgroundColor: formData.headerColor }}
                  >
                    <h4 className="font-semibold">{formData.name || 'Template Name'}</h4>
                  </div>

                  <div className="space-y-3">
                    {formData.fields.slice(0, 5).map((field, index) => (
                      <div key={index}>
                        {field.type === 'section' ? (
                          <div 
                            className="font-medium py-1 border-b"
                            style={{ borderBottomColor: formData.accentColor }}
                          >
                            {field.label}
                          </div>
                        ) : (
                          <div>
                            <label className="text-xs text-gray-600">{field.label}</label>
                            <div className="h-6 bg-gray-100 rounded mt-1"></div>
                          </div>
                        )}
                      </div>
                    ))}
                    {formData.fields.length > 5 && (
                      <div className="text-center text-gray-500 text-sm">
                        ... and {formData.fields.length - 5} more fields
                      </div>
                    )}
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2">
                  <EyeIcon className="h-4 w-4" />
                  <span>Full Preview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/invoices" className="text-blue-600 hover:text-blue-800">
                  <ArrowLeftIcon className="h-6 w-6" />
                </Link>
                <div className="flex items-center space-x-3">
                  <LayoutTemplateIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Invoice Templates</h1>
                    <p className="text-sm text-gray-600">Manage and customize invoice templates</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>New Template</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Category Filter */}
              <div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-3">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Template Preview */}
                <div 
                  className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative"
                  style={{ 
                    background: `linear-gradient(135deg, ${template.headerColor}20, ${template.accentColor}10)` 
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileTextIcon className="h-16 w-16 text-gray-400" />
                  </div>
                  {template.isDefault && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <StarIcon className="h-3 w-3" />
                        <span>Default</span>
                      </span>
                    </div>
                  )}
                  {!template.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full">Inactive</span>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{template.name}</h3>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${template.headerColor}20`, 
                        color: template.headerColor 
                      }}
                    >
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>Used {template.usageCount} times</span>
                    </div>
                    <span>Last: {new Date(template.lastUsed).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => editTemplate(template)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-semibold transition-colors duration-200 text-sm"
                    >
                      Use Template
                    </button>
                    <button
                      onClick={() => editTemplate(template)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Edit"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => duplicateTemplate(template)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Duplicate"
                    >
                      <CopyIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      title="Delete"
                      disabled={template.isDefault}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                          style={{ backgroundColor: `${template.headerColor}20` }}
                        >
                          <FileTextIcon className="h-5 w-5" style={{ color: template.headerColor }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                            <span>{template.name}</span>
                            {template.isDefault && <StarIcon className="h-4 w-4 text-yellow-500" />}
                          </p>
                          <p className="text-sm text-gray-500">{template.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${template.headerColor}20`, 
                          color: template.headerColor 
                        }}
                      >
                        {template.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p>{template.usageCount} times</p>
                        <p className="text-xs text-gray-500">Last: {new Date(template.lastUsed).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editTemplate(template)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => duplicateTemplate(template)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          title="Duplicate"
                        >
                          <CopyIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleTemplateStatus(template.id)}
                          className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                          title={template.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <SettingsIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                          disabled={template.isDefault}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <LayoutTemplateIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No templates found</p>
            <p className="text-sm text-gray-400 mt-2">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first invoice template to get started'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}