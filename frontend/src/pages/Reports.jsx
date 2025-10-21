import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Filter, 
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Package,
  DollarSign
} from 'lucide-react';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  const reportTypes = [
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign, color: 'success' },
    { id: 'parties', name: 'Parties Report', icon: Users, color: 'primary' },
    { id: 'delivery', name: 'Delivery Report', icon: Package, color: 'warning' },
    { id: 'performance', name: 'Performance Report', icon: TrendingUp, color: 'error' },
  ];

  const generateReport = () => {
    // Mock report generation
    console.log('Generating report:', selectedReport, dateRange);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate and download detailed reports
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
          <Button variant="primary" leftIcon={<Download className="w-4 h-4" />}>
            Download All
          </Button>
        </div>
      </div>

      {/* Report Type Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Select Report Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const IconComponent = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedReport === report.id
                    ? `border-${report.color}-500 bg-${report.color}-50 dark:bg-${report.color}-900/20`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <IconComponent className={`w-8 h-8 mb-2 ${
                    selectedReport === report.id
                      ? `text-${report.color}-600`
                      : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    selectedReport === report.id
                      ? `text-${report.color}-700 dark:text-${report.color}-300`
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {report.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Date Range Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Select Date Range
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Date
            </label>
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Date
            </label>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>
        </div>
      </Card>

      {/* Report Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Report Preview
          </h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" leftIcon={<BarChart3 className="w-4 h-4" />}>
              Bar Chart
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<PieChart className="w-4 h-4" />}>
              Pie Chart
            </Button>
          </div>
        </div>
        
        <div className="h-96 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
              Report Preview
            </h4>
            <p className="text-gray-500 dark:text-gray-500">
              Select a report type and date range to generate preview
            </p>
          </div>
        </div>
      </Card>

      {/* Report Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Generate Report
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Export your selected report in PDF or Excel format from Vinagaya Transport
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" leftIcon={<FileText className="w-4 h-4" />}>
              PDF
            </Button>
            <Button variant="secondary" leftIcon={<BarChart3 className="w-4 h-4" />}>
              Excel
            </Button>
            <Button 
              variant="primary" 
              leftIcon={<Download className="w-4 h-4" />}
              onClick={generateReport}
            >
              Generate
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Reports */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Recent Reports
        </h3>
        <div className="space-y-4">
          {[
            { name: 'Revenue Report - Q1 2024', date: '2024-01-15', size: '2.4 MB', type: 'PDF' },
            { name: 'Vinagaya Transport - Parties Report - March 2024', date: '2024-03-31', size: '1.8 MB', type: 'Excel' },
            { name: 'Delivery Performance - Q1', date: '2024-04-01', size: '3.2 MB', type: 'PDF' },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                  <p className="text-sm text-gray-500">{report.date} • {report.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-primary">{report.type}</span>
                <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default Reports;
