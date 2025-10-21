import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  MapPin,
  Phone,
  Package,
  Clock,
  Eye,
  Edit,
  Share2,
  Trash2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { formatDate } from '@utils';
import { partyService } from '@services/partyService';
import DataTable from '@components/data/DataTable';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Badge from '@components/ui/Badge';
import FilterPanel from '@components/data/FilterPanel';
import { useAppStore } from '@store/appStore';

const PartiesList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { searchQuery, filters, setSearchQuery, setFilters } = useAppStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Query for parties data
  const { data: parties = [], isLoading, error } = useQuery(
    ['parties', filters],
    () => partyService.getParties(filters),
    {
      staleTime: 30000,
      cacheTime: 300000,
    }
  );

  // Delete party mutation
  const deletePartyMutation = useMutation(
    (partyId) => partyService.deleteParty(partyId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['parties']);
        queryClient.invalidateQueries(['stats']);
      },
      onError: (error) => {
        console.error('Failed to delete party:', error);
      },
    }
  );

  // Bulk operations
  const bulkDeleteMutation = useMutation(
    (partyIds) => partyService.bulkDelete(partyIds),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['parties']);
        queryClient.invalidateQueries(['stats']);
        setSelectedRows([]);
      },
    }
  );

  // Table columns configuration
  const columns = useMemo(() => [
    {
      key: 'serialNo',
      header: 'S.No',
      accessorKey: 'serialNo',
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{getValue()}</span>
      ),
      width: '80px',
    },
    {
      key: 'partyName',
      header: 'Party Name',
      accessorKey: 'partyName',
      cell: ({ getValue, row }) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {getValue()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {row._id?.slice(-8)}
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      accessorKey: 'phone',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{getValue() || '—'}</span>
        </div>
      ),
    },
    {
      key: 'route',
      header: 'Route',
      accessorKey: 'route',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="font-medium">{row.place || '—'}</span>
          </div>
          {row.sellingPlace && (
            <>
              <span className="text-gray-400">→</span>
              <span>{row.sellingPlace}</span>
            </>)
          }
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      accessorKey: 'quantity',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{getValue() || 0}</span>
        </div>
      ),
    },
    {
      key: 'reminder',
      header: 'Reminder',
      accessorKey: 'reminder',
      cell: ({ getValue }) => {
        const reminder = getValue();
        if (!reminder) return <span className="text-gray-400">—</span>;
        
        const isOverdue = new Date(reminder) < new Date();
        const isToday = new Date(reminder).toDateString() === new Date().toDateString();
        
        return (
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isOverdue ? 'text-error-400' : 'text-gray-400'}`} />
            <Badge 
              variant={isOverdue ? 'error' : isToday ? 'warning' : 'primary'}
              size="sm"
            >
              {formatDate(reminder, 'MMM dd')}
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'batch',
      header: 'Batch Period',
      accessorKey: 'batchPeriod',
      cell: ({ row }) => {
        const batchFrom = row.batchFrom;
        const batchTo = row.batchTo;
        
        if (!batchFrom) return <span className="text-gray-400">—</span>;
        
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="text-sm">
              <div>{formatDate(batchFrom, 'MMM dd')}</div>
              {batchTo && (
                <div className="text-gray-500">to {formatDate(batchTo, 'MMM dd')}</div>
              )}
            </div>
          </div>
        );
      },
    },
  ], []);

  // Handle row actions
  const handleView = (party) => {
    navigate(`/parties/${party._id}`);
  };

  const handleEdit = (party) => {
    navigate(`/parties/${party._id}/edit`);
  };

  const handleDelete = async (party) => {
    if (confirm(`Are you sure you want to delete "${party.partyName}"?`)) {
      deletePartyMutation.mutate(party._id);
    }
  };

  const handleShare = async (party) => {
    const text = [
      `Vinagaya Party Details`,
      ``,
      `Party: ${party.partyName}`,
      `Phone: ${party.phone || 'N/A'}`,
      `From: ${party.place || 'N/A'}`,
      `To: ${party.sellingPlace || 'N/A'}`,
      `Quantity: ${party.quantity || 'N/A'}`,
      `Reminder: ${party.reminder ? formatDate(party.reminder) : 'N/A'}`,
      `Serial No: ${party.serialNo || 'N/A'}`,
    ].join('\n');
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleBulkShare = () => {
    if (selectedRows.length === 0) {
      alert('Please select parties to share');
      return;
    }
    setShowShareModal(true);
  };

  // Handle bulk actions
  const handleBulkAction = async () => {
    if (!selectedRows.length) return;
    
    if (bulkAction === 'share') {
      handleBulkShare();
    } else if (bulkAction === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedRows.length} parties?`)) {
        bulkDeleteMutation.mutate(selectedRows);
      }
    } else if (bulkAction === 'export') {
      // Handle bulk export
      const selectedPartiesData = parties.filter(party => selectedRows.includes(party._id));
      const exportData = selectedPartiesData.map(party => ({
        'Party Name': party.partyName || '',
        'Phone': party.phone || '',
        'Place': party.place || '',
        'Selling Place': party.sellingPlace || '',
        'Quantity': party.quantity || 0,
        'Batch From': party.batchFrom ? new Date(party.batchFrom).toLocaleDateString() : '',
        'Batch To': party.batchTo ? new Date(party.batchTo).toLocaleDateString() : '',
        'Reminder': party.reminder ? new Date(party.reminder).toLocaleDateString() : '',
        'Serial No': party.serialNo || ''
      }));
      
      const csvContent = [
        Object.keys(exportData[0] || {}).join(','),
        ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `selected-parties-${selectedRows.length}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(`Exported ${selectedRows.length} parties successfully!`);
    }
    
    setBulkAction('');
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return parties;
    
    return parties.filter(party =>
      party.partyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      party.phone?.includes(searchQuery) ||
      party.place?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      party.sellingPlace?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [parties, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="page-title">Parties</h1>
          <p className="page-subtitle">
            Manage transport parties and track shipments
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/parties/new')}
          >
            Add Party
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card overflow-hidden"
          >
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-3 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search parties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              clearable
            />
          </div>
          
          <Button
            variant="secondary"
            leftIcon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-primary-50 text-primary-700 border-primary-300' : ''}
          >
            Filters
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-2 items-center"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedRows.length} selected
            </span>
            
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Bulk Actions</option>
              <option value="share">Share Selected</option>
              <option value="export">Export Selected</option>
              <option value="delete">Delete Selected</option>
            </select>
            
            <Button
              variant="error"
              size="sm"
              onClick={handleBulkAction}
              disabled={!bulkAction}
            >
              Apply
            </Button>
          </motion.div>
        )}
      </div>

      {/* Data Table */}
      <Card className="p-0">
        <DataTable
          data={filteredData}
          columns={columns}
          loading={isLoading}
          onRowClick={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShare={handleShare}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          pagination={true}
          pageSize={15}
          searchable={true}
          exportable={true}
          filterable={true}
          emptyStateContent={
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No parties found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first party'}
              </p>
              <Button onClick={() => navigate('/parties/new')}>
                Add Party
              </Button>
            </div>
          }
        />
      </Card>

      {/* Share Modal */}
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Share Selected Parties
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowShareModal(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share {selectedRows.length} selected parties via WhatsApp
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {parties
                .filter(party => selectedRows.includes(party._id))
                .map((party, index) => (
                  <div key={party._id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {party.partyName}
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {party.phone} • {party.place} • Qty: {party.quantity}
                        </div>
                      </div>
                      <Badge variant="primary" size="sm">
                        #{party.serialNo || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowShareModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<Share2 className="w-4 h-4" />}
                onClick={() => {
                  const selectedPartiesData = parties.filter(party => selectedRows.includes(party._id));
                  
                  // Create simple format for each party
                  let shareText = `Vinagaya Parties Summary (${selectedPartiesData.length} parties)\n\n`;
                  
                  selectedPartiesData.forEach((party, index) => {
                    shareText += `${index + 1}. Party: ${party.partyName}\n`;
                    shareText += `Phone: ${party.phone || 'N/A'}\n`;
                    shareText += `From: ${party.place || 'N/A'}\n`;
                    shareText += `To: ${party.sellingPlace || 'N/A'}\n`;
                    shareText += `Quantity: ${party.quantity || 'N/A'}\n`;
                    shareText += `Reminder: ${party.reminder ? formatDate(party.reminder) : 'N/A'}\n`;
                    shareText += `Serial No: ${party.serialNo || 'N/A'}\n\n`;
                  });
                  
                  shareText += `Total Parties: ${selectedPartiesData.length}`;
                  
                  const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                  window.open(url, '_blank');
                  setShowShareModal(false);
                }}
              >
                Share via WhatsApp
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PartiesList;

