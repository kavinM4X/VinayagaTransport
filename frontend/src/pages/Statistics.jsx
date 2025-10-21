import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Calendar,
  MapPin,
  BarChart3,
  PieChart
} from 'lucide-react';
import Card from '@components/ui/Card';
import StatsCard from '@components/widgets/StatsCard';
import { useQuery } from 'react-query';
import { partyService } from '@services/partyService';

const Statistics = () => {
  // Load the same stats used on Dashboard to keep numbers consistent
  const { data: apiStats } = useQuery(['stats'], () => partyService.getStatistics(), {
    staleTime: 60000,
  });

  // Fallback if API not available
  const fallbackStats = {
    total: 127,
    remindersDue: 8,
    dueToday: 3,
    overdue: 5,
    avgQuantity: 45,
    batches: [
      { _id: '2024-01', count: 12 },
      { _id: '2024-02', count: 15 },
      { _id: '2024-03', count: 18 },
      { _id: '2024-04', count: 22 },
      { _id: '2024-05', count: 19 },
    ],
    topPlaces: [
      { _id: 'Mumbai', count: 45 },
      { _id: 'Delhi', count: 38 },
      { _id: 'Bangalore', count: 32 },
    ],
  };

  const stats = apiStats || fallbackStats;

  const recentActivity = [
    { id: 1, party: 'ABC Logistics', status: 'In Transit', time: '2 hours ago' },
    { id: 2, party: 'XYZ Transport', status: 'Delivered', time: '4 hours ago' },
    { id: 3, party: 'Quick Cargo', status: 'Processing', time: '6 hours ago' },
  ];

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
            Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of your transport operations
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary">
            <Calendar className="w-4 h-4" />
            Last 30 days
          </button>
          <button className="btn btn-primary">
            <BarChart3 className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Parties"
          value={stats.total}
          icon={<Users className="w-5 h-5" />}
          change="+12%"
          trend="positive"
        />
        <StatsCard
          title="Due Today"
          value={stats.dueToday}
          icon={<Package className="w-5 h-5" />}
          change="+8%"
          trend="positive"
        />
        <StatsCard
          title="Active Reminders"
          value={stats.remindersDue}
          icon={<DollarSign className="w-5 h-5" />}
          change="+15%"
          trend="positive"
        />
        <StatsCard
          title="Avg. Quantity"
          value={Math.round(stats.avgQuantity || 0)}
          icon={<Calendar className="w-5 h-5" />}
          change="-5%"
          trend="negative"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Trend (using batches) */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Volume Trend
            </h3>
            <button className="btn btn-ghost btn-sm">
              <PieChart className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {(stats.batches || []).map((batch, index) => (
              <div key={batch._id || index} className="flex items-center gap-4">
                <div className="text-sm font-medium w-16">{batch._id}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((batch.count / 25) * 100, 100)}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                  />
                </div>
                <div className="text-sm font-semibold w-12 text-right">{batch.count}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Routes (using topPlaces) */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Routes
            </h3>
            <button className="btn btn-ghost btn-sm">
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {(stats.topPlaces || []).map((place) => (
              <div key={place._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span className="font-medium">{place._id}</span>
                </div>
                <span className="text-sm text-gray-500">{place.count} trips</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{activity.party}</p>
                  <p className="text-sm text-gray-500">{activity.status}</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default Statistics;
