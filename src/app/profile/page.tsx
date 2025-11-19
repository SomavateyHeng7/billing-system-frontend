'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Camera,
  Lock,
  Bell,
  CreditCard,
  Building,
  FileText,
  Settings,
  LogOut,
  Check,
  AlertTriangle
} from 'lucide-react';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/shared/header';
import Footer from '@/components/shared/footer';

// TypeScript interfaces
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  profileImage: string;
  role: string;
  department: string;
  employeeId: string;
  joinDate: string;
  licenseNumber?: string;
  specialization?: string;
  status: 'Active' | 'Inactive';
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  loginNotifications: boolean;
  sessionTimeout: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  paymentAlerts: boolean;
  systemUpdates: boolean;
}

export default function ViewProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Mock user data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'EMP001',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    address: '123 Medical Center Drive',
    city: 'San Francisco',
    state: 'California',
    zipCode: '94102',
    country: 'United States',
    profileImage: '/api/placeholder/150/150',
    role: 'Senior Physician',
    department: 'Cardiology',
    employeeId: 'DOC-2021-001',
    joinDate: '2021-01-15',
    licenseNumber: 'CA-MD-123456',
    specialization: 'Interventional Cardiology',
    status: 'Active'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    lastPasswordChange: '2024-10-15',
    loginNotifications: true,
    sessionTimeout: 30
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    appointmentReminders: true,
    paymentAlerts: true,
    systemUpdates: false
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  const handleSaveProfile = () => {
    setUserProfile(editedProfile);
    setIsEditing(false);
    // Here you would typically make an API call to save the profile
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = e.target?.result as string;
        if (isEditing) {
          setEditedProfile({ ...editedProfile, profileImage: newImage });
        } else {
          setUserProfile({ ...userProfile, profileImage: newImage });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <Header sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 p-3 sm:p-4 md:p-6 pt-16 sm:pt-18 md:pt-20 ${sidebarCollapsed ? 'ml-0 sm:ml-14' : 'ml-0 sm:ml-56'}`}>
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            User Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage your account information, security settings, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={isEditing ? editedProfile.profileImage : userProfile.profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-gray-200 dark:border-gray-600"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
                  {userProfile.firstName} {userProfile.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{userProfile.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{userProfile.department}</p>
                
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-3 ${
                  userProfile.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    userProfile.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  {userProfile.status}
                </div>

                <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Employee ID:</span>
                    <span className="font-medium">{userProfile.employeeId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Join Date:</span>
                    <span className="font-medium">{new Date(userProfile.joinDate).toLocaleDateString()}</span>
                  </div>
                  {userProfile.licenseNumber && (
                    <div className="flex items-center justify-between">
                      <span>License:</span>
                      <span className="font-medium">{userProfile.licenseNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Profile Information
                    </h3>
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveProfile}
                            className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <Save size={16} className="mr-2" />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                          >
                            <X size={16} className="mr-2" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Edit size={16} className="mr-2" />
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                        Personal Information
                      </h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.firstName}
                            onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">{userProfile.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.lastName}
                            onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">{userProfile.lastName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editedProfile.email}
                            onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">{userProfile.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedProfile.phone}
                            onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">{userProfile.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date of Birth
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editedProfile.dateOfBirth}
                            onChange={(e) => setEditedProfile({ ...editedProfile, dateOfBirth: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">
                            {new Date(userProfile.dateOfBirth).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                        Professional Information
                      </h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Role
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.role}
                            onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">{userProfile.role}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Department
                        </label>
                        {isEditing ? (
                          <select
                            value={editedProfile.department}
                            onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="Cardiology">Cardiology</option>
                            <option value="Emergency">Emergency</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="Surgery">Surgery</option>
                            <option value="Radiology">Radiology</option>
                            <option value="Laboratory">Laboratory</option>
                            <option value="Administration">Administration</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 dark:text-white">{userProfile.department}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          License Number
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.licenseNumber || ''}
                            onChange={(e) => setEditedProfile({ ...editedProfile, licenseNumber: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">{userProfile.licenseNumber || 'N/A'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Specialization
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.specialization || ''}
                            onChange={(e) => setEditedProfile({ ...editedProfile, specialization: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white">{userProfile.specialization || 'N/A'}</p>
                        )}
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="md:col-span-2 space-y-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                        Address Information
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Street Address
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.address}
                              onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{userProfile.address}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            City
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.city}
                              onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{userProfile.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            State
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.state}
                              onChange={(e) => setEditedProfile({ ...editedProfile, state: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{userProfile.state}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ZIP Code
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.zipCode}
                              onChange={(e) => setEditedProfile({ ...editedProfile, zipCode: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{userProfile.zipCode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Security Settings
                  </h3>

                  <div className="space-y-6">
                    {/* Password Section */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Password</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Last changed: {new Date(securitySettings.lastPasswordChange).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => setShowChangePassword(true)}
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Lock size={16} className="mr-2" />
                          Change Password
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={securitySettings.twoFactorEnabled}
                            onChange={(e) => setSecuritySettings({
                              ...securitySettings,
                              twoFactorEnabled: e.target.checked
                            })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Login Notifications */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Login Notifications</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Get notified when someone logs into your account
                          </p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={securitySettings.loginNotifications}
                            onChange={(e) => setSecuritySettings({
                              ...securitySettings,
                              loginNotifications: e.target.checked
                            })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {securitySettings.loginNotifications ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Session Timeout */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Session Timeout</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Automatically log out after period of inactivity
                        </p>
                        <select
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings,
                            sessionTimeout: Number(e.target.value)
                          })}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={120}>2 hours</option>
                          <option value={240}>4 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Notification Preferences
                  </h3>

                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {key === 'emailNotifications' && 'Receive notifications via email'}
                            {key === 'smsNotifications' && 'Receive notifications via SMS'}
                            {key === 'pushNotifications' && 'Receive browser push notifications'}
                            {key === 'appointmentReminders' && 'Get reminders about upcoming appointments'}
                            {key === 'paymentAlerts' && 'Alerts about payment processing and issues'}
                            {key === 'systemUpdates' && 'Notifications about system maintenance and updates'}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              [key]: e.target.checked
                            })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {value ? 'On' : 'Off'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => alert('Notification settings saved!')}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check size={16} className="mr-2" />
                      Save Notification Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Application Preferences
                  </h3>

                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Language</h4>
                      <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white">
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Time Zone</h4>
                      <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white">
                        <option>Pacific Time (PT)</option>
                        <option>Mountain Time (MT)</option>
                        <option>Central Time (CT)</option>
                        <option>Eastern Time (ET)</option>
                      </select>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Date Format</h4>
                      <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => alert('Preferences saved!')}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check size={16} className="mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowChangePassword(false);
                      alert('Password changed successfully!');
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}