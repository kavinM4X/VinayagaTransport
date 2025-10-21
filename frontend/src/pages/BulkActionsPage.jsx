import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Download, 
  Trash2, 
  Edit, 
  CheckSquare, 
  Square,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { partyService } from '@services/partyService';
import { generateCSV } from '@utils';

const BulkActionsPage = () => {
  const [selectedParties, setSelectedParties] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: parties, isLoading } = useQuery(
    ['parties-bulk'],
    () => partyService.getParties({ limit: 1000 }),
    {
      staleTime: 30000,
    }
  );

  const deletePartiesMutation = useMutation(
    (partyIds) => Promise.all(partyIds.map(id => partyService.deleteParty(id))),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['parties-bulk']);
        queryClient.invalidateQueries(['parties']);
        queryClient.invalidateQueries(['stats']);
        setSelectedParties([]);
        alert('Selected parties deleted successfully!');
      },
      onError: (error) => {
        console.error('Delete error:', error);
        alert('Failed to delete parties. Please try again.');
      }
    }
  );

  const updatePartiesMutation = useMutation(
    ({ partyIds, updateData }) => Promise.all(
      partyIds.map(id => partyService.updateParty(id, updateData))
    ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['parties-bulk']);
        queryClient.invalidateQueries(['parties']);
        queryClient.invalidateQueries(['stats']);
        setSelectedParties([]);
        alert('Selected parties updated successfully!');
      },
      onError: (error) => {
        console.error('Update error:', error);
        alert('Failed to update parties. Please try again.');
      }
    }
  );

  const handleSelectAll = () => {
    if (selectedParties.length === parties?.length) {
      setSelectedParties([]);
    } else {
      setSelectedParties(parties?.map(party => party._id) || []);
    }
  };

  const handleSelectParty = (partyId) => {
    setSelectedParties(prev => 
      prev.includes(partyId) 
        ? prev.filter(id => id !== partyId)
        : [...prev, partyId]
    );
  };

  const handleBulkUpdate = () => {
    if (selectedParties.length === 0) {
      alert('Please select parties to update');
      return;
    }
    
    const newStatus = prompt('Enter new status for selected parties:');
    if (newStatus) {
      setConfirmAction({
        type: 'update',
        data: { status: newStatus },
        count: selectedParties.length
      });
      setShowConfirmDialog(true);
    }
  };

  const handleBulkExport = () => {
    if (selectedParties.length === 0) {
      alert('Please select parties to export');
      return;
    }

    const selectedPartiesData = parties?.filter(party => 
      selectedParties.includes(party._id)
    ) || [];

    const exportData = selectedPartiesData.map(party => ({
      'Party Name': party.partyName || '',
      'Phone': party.phone || '',
      'Place': party.place || '',
      'Quantity': party.quantity || 0,
      'Batch From': party.batchFrom ? new Date(party.batchFrom).toLocaleDateString() : '',
      'Batch To': party.batchTo ? new Date(party.batchTo).toLocaleDateString() : '',
      'Reminder': party.reminder ? new Date(party.reminder).toLocaleDateString() : '',
      'Created At': party.createdAt ? new Date(party.createdAt).toLocaleDateString() : '',
      'Serial No': party.serialNo || ''
    }));

    generateCSV(exportData, `vinagaya-transport-bulk-export-${selectedParties.length}-parties-${new Date().toISOString().split('T')[0]}.csv`);
    alert(`Exported ${selectedParties.length} parties successfully!`);
  };

  const handleBulkDelete = () => {
    if (selectedParties.length === 0) {
      alert('Please select parties to delete');
      return;
    }
    
    setConfirmAction({
      type: 'delete',
      count: selectedParties.length
    });
    setShowConfirmDialog(true);
  };

  const confirmActionHandler = async () => {
    setIsProcessing(true);
    setActionType(confirmAction.type);
    
    try {
      if (confirmAction.type === 'delete') {
        await deletePartiesMutation.mutateAsync(selectedParties);
      } else if (confirmAction.type === 'update') {
        await updatePartiesMutation.mutateAsync({
          partyIds: selectedParties,
          updateData: confirmAction.data
        });
      }
    } catch (error) {
      console.error('Bulk action error:', error);
    } finally {
      setIsProcessing(false);
      setActionType('');
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="page-header">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="page-title">Bulk Actions</h1>
            <p className="page-subtitle">
              Perform bulk operations on multiple parties at once.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">
              {selectedParties.length} selected
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Bulk Action Buttons */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold">Bulk Operations</h3>
            <p className="text-sm text-gray-600 mt-1">
              Select parties below and choose an action to perform
            </p>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bulk Update Status */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                  <Edit className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Bulk Update Status</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update status for selected parties
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBulkUpdate}
                  disabled={selectedParties.length === 0 || isProcessing}
                  className="w-full"
                >
                  {isProcessing && actionType === 'update' ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </motion.div>

            {/* Bulk Export Selected */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-lg">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Bulk Export Selected</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Export selected parties to CSV
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBulkExport}
                  disabled={selectedParties.length === 0 || isProcessing}
                  className="w-full"
                >
                  Export Selected
                </Button>
              </div>
            </motion.div>

            {/* Bulk Delete Selected */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-300 dark:hover:border-red-600 transition-colors"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Bulk Delete Selected</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Delete selected parties permanently
                  </p>
                </div>
                <Button
                  variant="error"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={selectedParties.length === 0 || isProcessing}
                  className="w-full"
                >
                  {isProcessing && actionType === 'delete' ? 'Deleting...' : 'Delete Selected'}
                </Button>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Parties List */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Select Parties</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose parties to perform bulk operations on
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSelectAll}
                leftIcon={selectedParties.length === parties?.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              >
                {selectedParties.length === parties?.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600">Loading parties...</span>
              </div>
            ) : parties && parties.length > 0 ? (
              <div className="space-y-2">
                {parties.map((party, index) => (
                  <motion.div
                    key={party._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border rounded-lg transition-all cursor-pointer ${
                      selectedParties.includes(party._id)
                        ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleSelectParty(party._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {selectedParties.includes(party._id) ? (
                          <CheckSquare className="w-5 h-5 text-primary-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {party.partyName || 'Unnamed Party'}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>{party.phone || 'No phone'}</span>
                          <span>{party.place || 'No place'}</span>
                          <span>Qty: {party.quantity || 0}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge variant="primary" size="sm">
                          #{party.serialNo || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No parties found
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Action
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to {confirmAction?.type} {confirmAction?.count} selected parties? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="error"
                onClick={confirmActionHandler}
                loading={isProcessing}
                leftIcon={<CheckCircle className="w-4 h-4" />}
              >
                {isProcessing ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BulkActionsPage;
