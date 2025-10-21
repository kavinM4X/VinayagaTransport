import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  Package, 
  Clock, 
  Save, 
  X 
} from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Card from '@components/ui/Card';

const PartyForm = ({ initialData = {}, onSubmit, loading, onCancel }) => {
  const [formData, setFormData] = useState({
    partyName: initialData.partyName || '',
    phone: initialData.phone || '',
    batchFrom: initialData.batchFrom ? initialData.batchFrom.split('T')[0] : '',
    batchTo: initialData.batchTo ? initialData.batchTo.split('T')[0] : '',
    place: initialData.place || '',
    sellingPlace: initialData.sellingPlace || '',
    quantity: initialData.quantity || '',
    reminder: initialData.reminder ? initialData.reminder.split('T')[0] : ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Party Information
        </h2>
        {onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            leftIcon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Party Name */}
          <div>
            <label htmlFor="partyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Party Name *
            </label>
            <Input
              id="partyName"
              name="partyName"
              type="text"
              value={formData.partyName}
              onChange={handleChange}
              placeholder="Enter party name"
              icon={<User className="w-5 h-5" />}
              required
              disabled={loading}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              icon={<Phone className="w-5 h-5" />}
              disabled={loading}
            />
          </div>

          {/* Batch From */}
          <div>
            <label htmlFor="batchFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Batch From
            </label>
            <Input
              id="batchFrom"
              name="batchFrom"
              type="date"
              value={formData.batchFrom}
              onChange={handleChange}
              icon={<Calendar className="w-5 h-5" />}
              disabled={loading}
            />
          </div>

          {/* Batch To */}
          <div>
            <label htmlFor="batchTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Batch To
            </label>
            <Input
              id="batchTo"
              name="batchTo"
              type="date"
              value={formData.batchTo}
              onChange={handleChange}
              icon={<Calendar className="w-5 h-5" />}
              disabled={loading}
            />
          </div>

          {/* Place (From) */}
          <div>
            <label htmlFor="place" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Place
            </label>
            <Input
              id="place"
              name="place"
              type="text"
              value={formData.place}
              onChange={handleChange}
              placeholder="Origin location"
              icon={<MapPin className="w-5 h-5" />}
              disabled={loading}
            />
          </div>

          {/* Selling Place (To) */}
          <div>
            <label htmlFor="sellingPlace" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Place
            </label>
            <Input
              id="sellingPlace"
              name="sellingPlace"
              type="text"
              value={formData.sellingPlace}
              onChange={handleChange}
              placeholder="Destination location"
              icon={<MapPin className="w-5 h-5" />}
              disabled={loading}
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              icon={<Package className="w-5 h-5" />}
              min="0"
              step="1"
              disabled={loading}
            />
          </div>

          {/* Reminder */}
          <div>
            <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reminder Date
            </label>
            <Input
              id="reminder"
              name="reminder"
              type="date"
              value={formData.reminder}
              onChange={handleChange}
              icon={<Clock className="w-5 h-5" />}
              disabled={loading}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 md:flex-none"
            >
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.partyName}
            leftIcon={<Save className="w-4 h-4" />}
            className="flex-1 md:flex-none"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </div>
            ) : (
              'Save Party'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default PartyForm;
