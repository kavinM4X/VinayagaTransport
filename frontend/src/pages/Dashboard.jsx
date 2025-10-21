import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Users,
  Clock,
  ArrowUpRight,
  Plus,
  Download,
  Share
} from 'lucide-react';
import { formatDate } from '@utils';
import { useQuery } from 'react-query';
import { partyService } from '@services/partyService';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import StatsCard from '@components/widgets/StatsCard';
import ActivityFeed from '@components/widgets/ActivityFeed';
import QuickActions from '@components/widgets/QuickActions';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery(
    ['stats'],
    () => partyService.getStatistics(),
    {
      staleTime: 60000, // 1 minute
      cacheTime: 300000, // 5 minutes
    }
  );

  const { data: recentParties, isLoading: partiesLoading } = useQuery(
    ['recent-parties'],
    () => partyService.getParties({ limit: 5 }),
    {
      staleTime: 30000,
    }
  );

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

  // Mock data when API is not available
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
    recentActivity: [
      { action: 'create', entityId: '123', createdAt: new Date() },
      { action: 'update', entityId: '456', createdAt: new Date() },
    ]
  };

  const displayStats = stats || fallbackStats;

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
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Welcome back! Here's what's happening with your transport operations.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={async () => {
                try {
                  const params = new URLSearchParams({ format: 'csv' }).toString();
                  const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/parties/export?${params}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                  });
                  if (!resp.ok) {
                    throw new Error('Failed to export');
                  }
                  const blob = await resp.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'parties.csv';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              Export Report
            </Button>
            
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => window.location.href = '/parties/new'}
            >
              Add Party
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Parties"
          value={displayStats.total}
          change="+12%"
          trend="positive"
          icon={<Users className="w-6 h-6" />}
          loading={statsLoading}
        />
        
        <StatsCard
          title="Due Today"
          value={displayStats.dueToday}
          change={`${displayStats.overdue} overdue`}
          trend="negative"
          icon={<Clock className="w-6 h-6" />}
          loading={statsLoading}
        />
        
        <StatsCard
          title="Active Reminders"
          value={displayStats.remindersDue}
          change="+3 this week"
          trend="neutral"
          icon={<Calendar className="w-6 h-6" />}
          loading={statsLoading}
        />
        
        <StatsCard
          title="Avg. Quantity"
          value={Math.round(displayStats.avgQuantity)}
          change="+8%"
          trend="positive"
          icon={<Package className="w-6 h-6" />}
          loading={statsLoading}
        />
      </motion.div>

      {/* Charts and Analytics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold">Batch Trends</h3>
            <p className="text-sm text-gray-600 mt-1">Transport volume over time</p>
          </div>
          
          <div className="mt-6">
            {statsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {displayStats.batches?.map((batch, index) => (
                  <motion.div
                    key={batch._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="text-sm font-medium w-16">{batch._id}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(batch.count / 25) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                      />
                    </div>
                    <div className="text-sm font-semibold w-12 text-right">{batch.count}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Card>

      <Card>
        <div className="card-header">
          <h3 className="text-lg font-semibold">Top Locations</h3>
          <p className="text-sm text-gray-600 mt-1">Most active places</p>
        </div>
        
        <div className="mt-6 space-y-3">
          {displayStats.topPlaces?.map((place, index) => (
            <motion.div
              key={place._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="font-medium">{place._id}</span>
              </div>
              <Badge variant="primary">{place.count}</Badge>
            </motion.div>
          ))}
        </div>
      </Card>
      </motion.div>

      {/* Quick Actions and Recent Activity */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        
        <div>
          <ActivityFeed activities={displayStats.recentActivity} loading={statsLoading} />
        </div>
      </motion.div>

      {/* Recent Parties */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Parties</h2>
          <Link to="/parties" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        
        <Card>
          <div className="space-y-0">
            {partiesLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : recentParties?.length > 0 ? (
              recentParties.map((party, index) => (
                <motion.div
                  key={party._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/parties/${party._id}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {party.partyName}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>{party.phone}</span>
                        <span>{party.place}</span>
                        <span>Qty: {party.quantity}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {party.reminder && (
                        <Badge 
                          variant={new Date(party.reminder) <= new Date() ? 'error' : 'warning'}
                          size="sm"
                        >
                          {formatDate(party.reminder, 'MMM dd')}
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No parties found. <Link to="/parties/new" className="text-primary-600 hover:underline">Add your first parties</Link>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;

