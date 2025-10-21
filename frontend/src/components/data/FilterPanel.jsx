import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Phone } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Card from '@components/ui/Card';

const FilterPanel = ({ filters = {}, onFiltersChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState({
    place: filters.place || '',
    phone: filters.phone || '',
    fromDate: filters.from || '',
    toDate: filters.to || '',
    reminder: filters.reminder || '',
    quantity: filters.quantity || '',
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    const activeFilters = Object.entries(localFilters).reduce((acc, [key, value]) => {
      if (value) {
        // Map internal keys to API keys
        const apiKey = {
          fromDate: 'from',
          toDate: 'to',
        }[key] || key;
        acc[apiKey] = value;
      }
      return acc;
    }, {});

    onFiltersChange(activeFilters);
    onClose?.();
  };

  const clearFilters = () => {
    setLocalFilters({
      place: '',
      phone: '',
      fromDate: '',
      toDate: '',
      reminder: '',
      quantity: '',
    });
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Advanced Filters</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          leftIcon={<X className="w-4 h-4" />}
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Place Filter */}
        <div>
          <Input
            label="Place"
            placeholder="Filter by location..."
            value={localFilters.place}
            onChange={(e) => handleFilterChange('place', e.target.value)}
            leftIcon={<MapPin className="w-4 h-4" />}
          />
        </div>

        {/* Phone Filter */}
        <div>
          <Input
            label="Phone"
            placeholder="Filter by phone..."
            value={localFilters.phone}
            onChange={(e) => handleFilterChange('phone', e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>

        {/* Reminder Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reminder Status
          </label>
          <select
            value={localFilters.reminder}
            onChange={(e) => handleFilterChange('reminder', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All</option>
            <option value="due">Due</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <Input
            label="Start Date"
            type="date"
            value={localFilters.fromDate}
            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
          />
        </div>

        <div>
          <Input
            label="End Date"
            type="date"
            value={localFilters.toDate}
            onChange={(e) => handleFilterChange('toDate', e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
          />
        </div>

        {/* Quantity Filter */}
        <div>
          <Input
            label="Minimum Quantity"
            type="number"
            placeholder="10"
            value={localFilters.quantity}
            onChange={(e) => handleFilterChange('quantity', e.target.value)}
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Filters
        </h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              setLocalFilters(prev => ({ ...prev, fromDate: today, toDate: today }));
            }}
          >
            Today
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              const today = new Date().toISOString().split('T')[0];
              setLocalFilters(prev => ({ ...prev, fromDate: weekAgo, toDate: today }));
            }}
          >
            Last Week
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              const today = new Date().toISOString().split('T')[0];
              setLocalFilters(prev => ({ ...prev, fromDate: monthAgo, toDate: today }));
            }}
          >
            Last Month
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocalFilters(prev => ({ ...prev, reminder: 'due' }))}
          >
            With Reminders
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocalFilters(prev => ({ ...prev, quantity: '50' }))}
          >
            High Volume
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Filters:
              </h5>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-error-600 hover:text-error-700"
              >
                Clear All
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(localFilters).map(([key, value]) => {
                if (!value) return null;
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                  >
                    <span>
                      <span className="font-medium capitalize">{key}:</span> {value}
                    </span>
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="secondary"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
        >
          Reset
        </Button>
        
        <Button
          variant="primary"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </motion.div>
  );
};

export default FilterPanel;

