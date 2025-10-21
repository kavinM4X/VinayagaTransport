import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Download, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Share
} from 'lucide-react';
import { cn } from '@utils';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Badge from '@components/ui/Badge';

const DataTable = ({
  data = [],
  columns = [],
  onRowClick,
  onEdit,
  onDelete,
  onShare,
  selectedRows: externalSelectedRows,
  onSelectedRowsChange,
  loading = false,
  searchPlaceholder = "Search...",
  emptyStateContent,
  className,
  pagination = true,
  pageSize = 10,
  sortable = true,
  filterable = true,
  exportable = true,
  actions = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [internalSelectedRows, setInternalSelectedRows] = useState(new Set());
  
  // Use external selectedRows if provided, otherwise use internal state
  const selectedRows = externalSelectedRows || internalSelectedRows;
  const setSelectedRows = onSelectedRowsChange || setInternalSelectedRows;

  // Filter and search data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sort
  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle row selection
  const toggleRowSelection = (rowId) => {
    setSelectedRows(prev => {
      if (Array.isArray(prev)) {
        // Handle array format (from external)
        if (prev.includes(rowId)) {
          return prev.filter(id => id !== rowId);
        } else {
          return [...prev, rowId];
        }
      } else {
        // Handle Set format (internal)
        const newSet = new Set(prev);
        if (newSet.has(rowId)) {
          newSet.delete(rowId);
        } else {
          newSet.add(rowId);
        }
        return newSet;
      }
    });
  };

  // Select all rows
  const selectAllRows = () => {
    const allIds = paginatedData.map(item => item._id || item.id);
    
    if (Array.isArray(selectedRows)) {
      // Handle array format
      if (selectedRows.length === paginatedData.length) {
        setSelectedRows([]);
      } else {
        setSelectedRows(allIds);
      }
    } else {
      // Handle Set format
      if (selectedRows.size === paginatedData.length) {
        setSelectedRows(new Set());
      } else {
        setSelectedRows(new Set(allIds));
      }
    }
  };

  // Handle export
  const handleExport = () => {
    const csvContent = [
      columns.map(col => col.header).join(','),
      ...paginatedData.map(row => 
        columns.map(col => `"${col.accessorKey ? row[col.accessorKey] : ''}"`).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vinagaya-transport-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 max-w-md">
          {filterable && (
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              variant="ghost"
              size="sm"
            />
          )}
        </div>
        
        <div className="flex gap-2">
          {exportable && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExport}
            >
              Export
            </Button>
          )}
          
          {filterable && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Filter className="w-4 h-4" />}
            >
              Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto px-2 sm:px-0" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {actions && (
                  <th className="text-left p-3 sm:p-4 hidden sm:table-cell">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(selectedRows) 
                          ? selectedRows.length === paginatedData.length && paginatedData.length > 0
                          : selectedRows.size === paginatedData.length && paginatedData.length > 0
                      }
                      onChange={selectAllRows}
                      className="rounded border-gray-300"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "text-left p-3 sm:p-4 font-semibold text-gray-600 dark:text-gray-300",
                      sortable && "cursor-pointer hover:text-gray-900 dark:hover:text-white",
                      column.width && `w-${column.width}`
                    )}
                    onClick={() => column.sortable !== false && handleSort(column.accessorKey)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      {sortable && column.sortable !== false && sortConfig.key === column.accessorKey && (
                        <>
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </>
                      )}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="text-right p-3 sm:p-4 hidden sm:table-cell">Actions</th>
                )}
              </tr>
            </thead>
            
            <tbody>
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td 
                      colSpan={columns.length + (actions ? 2 : 0)} 
                      className="p-6 sm:p-8 text-center text-gray-500"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </motion.div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td 
                      colSpan={columns.length + (actions ? 2 : 0)} 
                      className="p-6 sm:p-8 text-center"
                    >
                      {emptyStateContent || (
                        <div className="text-gray-500">
                          No data available
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => {
                    const isSelected = Array.isArray(selectedRows) 
                      ? selectedRows.includes(row._id || row.id)
                      : selectedRows.has(row._id || row.id);
                    
                    return (
                      <motion.tr
                        key={row._id || row.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className={cn(
                          "border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                          isSelected && "bg-primary-50 dark:bg-primary-900/20",
                          onRowClick && "cursor-pointer"
                        )}
                        onClick={() => onRowClick?.(row)}
                      >
                        {actions && (
                          <td className="p-3 sm:p-4 hidden sm:table-cell">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRowSelection(row._id || row.id)}
                              className="rounded border-gray-300"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                        )}
                        
                        {columns.map((column) => (
                          <td key={column.key} className="p-3 sm:p-4 whitespace-normal break-words">
                            {column.cell ? 
                              column.cell({ getValue: () => row[column.accessorKey], row }) : 
                              row[column.accessorKey]
                            }
                          </td>
                        ))}
                        
                        {actions && (
                          <td className="p-3 sm:p-4 hidden sm:table-cell">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRowClick?.(row);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit?.(row);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onShare?.(row);
                                }}
                              >
                                <Share className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Are you sure you want to delete this item?')) {
                                    onDelete?.(row);
                                  }
                                }}
                                className="text-error-600 hover:text-error-700 hover:bg-error-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev => Math.max(prev - 1, 1)))}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(totalPages - 4 + i, i + 1));
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DataTable;
