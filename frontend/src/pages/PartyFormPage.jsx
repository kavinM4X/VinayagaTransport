import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { partyService } from '@services/partyService';
import PartyForm from './PartyForm';

const PartyFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);

  // Load party data for editing
  const { data: party, isLoading: partyLoading } = useQuery(
    ['party', id],
    () => partyService.getParty(id),
    {
      enabled: isEdit,
      staleTime: 30000,
    }
  );

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (isEdit) {
        await partyService.updateParty(id, formData);
        toast.success('Party updated successfully!');
      } else {
        await partyService.createParty(formData);
        toast.success('Party created successfully!');
      }
      navigate('/parties');
    } catch (error) {
      toast.error(error.message || 'Failed to save party');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/parties');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Party' : 'Add New Party'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update party information' : 'Create a new transport party'}
          </p>
        </div>
      </div>

      {isEdit && partyLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <PartyForm
          initialData={isEdit ? party || {} : {}}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default PartyFormPage;
