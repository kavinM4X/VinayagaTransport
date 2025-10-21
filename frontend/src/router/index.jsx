import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Layouts
import AuthLayout from '@components/layout/AuthLayout';
import DashboardLayout from '@components/layout/DashboardLayout';
import AppShell from '@components/layout/AppShell';

// Auth Pages
const Login = React.lazy(() => import('@pages/Login'));
const Register = React.lazy(() => import('@pages/Register'));
const Welcome = React.lazy(() => import('@pages/Welcome'));

// Dashboard Pages
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const PartiesList = React.lazy(() => import('@pages/PartiesList'));
const PartyDetails = React.lazy(() => import('@pages/PartyDetails'));
const PartyFormPage = React.lazy(() => import('@pages/PartyFormPage'));
const Settings = React.lazy(() => import('@pages/Settings'));
const Statistics = React.lazy(() => import('@pages/Statistics'));
const Reports = React.lazy(() => import('@pages/Reports'));
const ExportPage = React.lazy(() => import('@pages/ExportPage'));
const BulkActionsPage = React.lazy(() => import('@pages/BulkActionsPage'));
const Batches = React.lazy(() => import('@pages/Batches'));
const Reminders = React.lazy(() => import('@pages/Reminders'));
const CalendarPage = React.lazy(() => import('@pages/Calendar'));
const PartiesWeight = React.lazy(() => import('@pages/PartiesWeight'));

// Loading component
const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </motion.div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/welcome" replace />;
};

// Public Route wrapper (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/" replace /> : children;
};

function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={
          <PublicRoute>
            <AuthLayout>
              <Welcome />
            </AuthLayout>
          </PublicRoute>
        } />
        
        <Route path="/login" element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/parties" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <PartiesList />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/parties/new" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <PartyFormPage />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/parties/:id" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <PartyDetails />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/parties/:id/edit" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <PartyFormPage />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/statistics" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <Statistics />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/batches" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <Batches />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/reminders" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <Reminders />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/calendar" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <CalendarPage />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/parties/weight" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <PartiesWeight />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        {/* Quick Actions Routes */}
        <Route path="/import" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Import Data</h2>
                  <p className="text-gray-600 mb-6">Upload CSV or Excel files to import party data into Vinagaya Transport</p>
                  <input type="file" accept=".csv,.xlsx,.xls" className="mb-4" />
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                    Upload File
                  </button>
                </div>
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/export" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <ExportPage />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/reminders/new" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Set Reminder</h2>
                  <p className="text-gray-600 mb-6">Schedule follow-up reminders for parties</p>
                  <div className="max-w-md mx-auto space-y-4">
                    <input type="text" placeholder="Reminder title" className="w-full p-3 border rounded-lg" />
                    <input type="datetime-local" className="w-full p-3 border rounded-lg" />
                    <button className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                      Set Reminder
                    </button>
                  </div>
                </div>
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/bulk" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <BulkActionsPage />
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />
        
        <Route path="/tracking" element={
          <ProtectedRoute>
            <AppShell>
              <DashboardLayout>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Track Shipment</h2>
                  <p className="text-gray-600 mb-6">Monitor shipment status and location</p>
                  <div className="max-w-md mx-auto space-y-4">
                    <input type="text" placeholder="Enter tracking number" className="w-full p-3 border rounded-lg" />
                    <button className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                      Track Shipment
                    </button>
                  </div>
                </div>
              </DashboardLayout>
            </AppShell>
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;

