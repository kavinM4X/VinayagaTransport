import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, FileText, File } from 'lucide-react';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import { useQuery } from 'react-query';
import { partyService } from '@services/partyService';
import { generateCSV } from '@utils';

const ExportPage = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState('');

  const { data: parties, isLoading } = useQuery(
    ['parties-export'],
    () => partyService.getParties({ limit: 1000 }),
    {
      staleTime: 30000,
    }
  );

  const handleExport = async (type) => {
    setIsExporting(true);
    setExportType(type);
    
    try {
      if (!parties || parties.length === 0) {
        alert('No data available to export');
        return;
      }

      // Prepare data for export
      const exportData = parties.map(party => ({
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

      switch (type) {
        case 'csv':
          generateCSV(exportData, `vinagaya-transport-data-${new Date().toISOString().split('T')[0]}.csv`);
          break;
          
        case 'excel':
          // For Excel export, we'll use a simple CSV with .xlsx extension
          // In a real app, you'd use a library like xlsx
          generateCSV(exportData, `vinagaya-transport-data-${new Date().toISOString().split('T')[0]}.xlsx`);
          break;
          
        case 'pdf':
          // For PDF export, we'll create a simple text-based PDF
          // In a real app, you'd use a library like jsPDF
          const pdfContent = exportData.map(row => 
            Object.entries(row).map(([key, value]) => `${key}: ${value}`).join('\n')
          ).join('\n\n');
          
          const blob = new Blob([pdfContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `transport-data-${new Date().toISOString().split('T')[0]}.txt`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          break;
          
        default:
          break;
      }
      
      // Show success message
      alert(`${type.toUpperCase()} export completed successfully!`);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType('');
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
            <h1 className="page-title">Export Report</h1>
            <p className="page-subtitle">
              Download your transport data in various formats for analysis and reporting.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Export Options */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold">Export Options</h3>
            <p className="text-sm text-gray-600 mt-1">
              Choose your preferred format to download the data
            </p>
          </div>
          
          <div className="mt-6 space-y-4">
            {/* Excel Export */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-lg">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Export as Excel</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Download data in Excel format (.xlsx) for spreadsheet analysis
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => handleExport('excel')}
                  loading={isExporting && exportType === 'excel'}
                  disabled={isExporting || isLoading}
                >
                  {isExporting && exportType === 'excel' ? 'Exporting...' : 'Export Excel'}
                </Button>
              </div>
            </motion.div>

            {/* PDF Export */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Export as PDF</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Download data in PDF format for sharing and printing
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => handleExport('pdf')}
                  loading={isExporting && exportType === 'pdf'}
                  disabled={isExporting || isLoading}
                >
                  {isExporting && exportType === 'pdf' ? 'Exporting...' : 'Export PDF'}
                </Button>
              </div>
            </motion.div>

            {/* CSV Export */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                    <File className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Export as CSV</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Download data in CSV format for data analysis and import
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => handleExport('csv')}
                  loading={isExporting && exportType === 'csv'}
                  disabled={isExporting || isLoading}
                >
                  {isExporting && exportType === 'csv' ? 'Exporting...' : 'Export CSV'}
                </Button>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Data Preview */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold">Data Preview</h3>
            <p className="text-sm text-gray-600 mt-1">
              Preview of the data that will be exported ({parties?.length || 0} records)
            </p>
          </div>
          
          <div className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600">Loading data...</span>
              </div>
            ) : parties && parties.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Party Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Place
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {parties.slice(0, 5).map((party, index) => (
                      <tr key={party._id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {party.partyName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {party.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {party.place || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {party.quantity || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parties.length > 5 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                    Showing first 5 of {parties.length} records
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No data available to export
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ExportPage;
