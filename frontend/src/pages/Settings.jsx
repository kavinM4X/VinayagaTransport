import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Palette, 
  Calendar, 
  Monitor, 
  Save, 
  Phone, 
  PhoneCall,
  Globe,
  Settings as SettingsIcon
} from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Card from '@components/ui/Card';
import { toast } from 'react-hot-toast';
import { useThemeStore } from '@store/themeStore';

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    role: 'staff'
  });
  
  const [preferences, setPreferences] = useState({
    defaultPage: '/',
    dateFormat: 'DD-MM-YYYY',
    tableDensity: 'comfortable',
    defaultColumns: {
      serialNo: true,
      partyName: true,
      phone: true,
      place: true,
      sellingPlace: true,
      quantity: true,
      reminder: true
    }
  });

  const [saving, setSaving] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('settings_profile') || '{}');
    const savedPrefs = JSON.parse(localStorage.getItem('settings_prefs') || '{}');
    
    setProfile(prev => ({ ...prev, ...savedProfile }));
    setPreferences(prev => ({ ...prev, ...savedPrefs }));
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('col_')) {
      const columnName = name.substring(4);
      setPreferences(prev => ({
        ...prev,
        defaultColumns: {
          ...prev.defaultColumns,
          [columnName]: checked
        }
      }));
    } else {
      setPreferences(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      localStorage.setItem('settings_profile', JSON.stringify(profile));
      toast.success('Profile saved successfully!');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      localStorage.setItem('settings_prefs', JSON.stringify(preferences));
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setPreferences(prev => ({ ...prev, theme: newTheme }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <SettingsIcon className="w-8 h-8 text-transport-orange" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your profile and application preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
                icon={<User className="w-5 h-5" />}
                disabled={saving}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={profile.role}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={saving}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleProfileChange}
                placeholder="Enter your phone number"
                icon={<Phone className="w-5 h-5" />}
                disabled={saving}
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                WhatsApp Number
              </label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                value={profile.whatsapp}
                onChange={handleProfileChange}
                placeholder="Enter your WhatsApp number"
                icon={<PhoneCall className="w-5 h-5" />}
                disabled={saving}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              leftIcon={<Save className="w-4 h-4" />}
              className="w-full"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </Card>

        {/* App Preferences */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="w-6 h-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              App Preferences
            </h2>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            {/* Theme */}
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'light', label: 'Light', icon: '☀️' },
                  { value: 'dark', label: 'Dark', icon: '🌙' },
                  { value: 'system', label: 'System', icon: '💻' }
                ].map((themeOption) => (
                  <button
                    key={themeOption.value}
                    type="button"
                    onClick={() => handleThemeChange(themeOption.value)}
                    className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${
                      theme === themeOption.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <span>{themeOption.icon}</span>
                    <span className="text-sm font-medium">{themeOption.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Default Page */}
            <div>
              <label htmlFor="defaultPage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Page
              </label>
              <select
                id="defaultPage"
                name="defaultPage"
                value={preferences.defaultPage}
                onChange={handlePreferencesChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={saving}
              >
                <option value="/">Dashboard</option>
                <option value="/parties">Parties</option>
              </select>
            </div>

            {/* Date Format */}
            <div>
              <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Format
              </label>
              <select
                id="dateFormat"
                name="dateFormat"
                value={preferences.dateFormat}
                onChange={handlePreferencesChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={saving}
              >
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            {/* Table Density */}
            <div>
              <label htmlFor="tableDensity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Table Density
              </label>
              <select
                id="tableDensity"
                name="tableDensity"
                value={preferences.tableDensity}
                onChange={handlePreferencesChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bh-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={saving}
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>

            {/* Default Columns */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Columns (Parties)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(preferences.defaultColumns).map((column) => (
                  <label
                    key={column}
                    className="flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={`col_${column}`}
                      checked={preferences.defaultColumns[column]}
                      onChange={handlePreferencesChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      disabled={saving}
                    />
                    <span className="text-sm capitalize">{column.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              leftIcon={<Save className="w-4 h-4" />}
              className="w-full"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </form>
        </Card>
      </div>
    </motion.div>
  );
};

export default Settings;

