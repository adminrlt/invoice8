import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { AdminAuthPage } from './pages/AdminAuthPage';
import { DepartmentListPage } from './pages/admin/DepartmentListPage';
import { EmployeeListPage } from './pages/admin/EmployeeListPage';
import { InvoiceListPage } from './pages/admin/InvoiceListPage';
import { InvoiceCasesPage } from './pages/admin/InvoiceCasesPage';
import { AdminUploadPage } from './pages/admin/UploadPage';
import { DocumentUploadPage } from './pages/DocumentUploadPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminRoute, PrivateRoute } from './components/routing';
import { useAuthRefresh } from './hooks/useAuthRefresh';
import { InvoiceDashboard } from './components/admin/dashboard/InvoiceDashboard';

const App = () => {
  // Enable session refresh
  useAuthRefresh();

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin/auth" element={<AdminAuthPage />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout>
                  <Navigate to="/admin/dashboard" replace />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminLayout>
                  <InvoiceDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/departments" element={
              <AdminRoute>
                <AdminLayout>
                  <DepartmentListPage />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/employees" element={
              <AdminRoute>
                <AdminLayout>
                  <EmployeeListPage />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/invoices" element={
              <AdminRoute>
                <AdminLayout>
                  <InvoiceListPage />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/cases" element={
              <AdminRoute>
                <AdminLayout>
                  <InvoiceCasesPage />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/upload" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminUploadPage />
                </AdminLayout>
              </AdminRoute>
            } />
            
            {/* User routes */}
            <Route path="/" element={
              <PrivateRoute>
                <DocumentUploadPage />
              </PrivateRoute>
            } />
            <Route path="/documents" element={
              <PrivateRoute>
                <DocumentUploadPage />
              </PrivateRoute>
            } />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;