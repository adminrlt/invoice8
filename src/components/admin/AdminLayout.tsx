import React from 'react';
import { Users, Building2, FileText, Upload, FileStack, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { DocumentProcessingStatus } from './DocumentProcessingStatus';

const navItems = [
  { path: '/admin/dashboard', label: 'Invoice Dashboard', icon: LayoutDashboard },
  { path: '/admin/departments', label: 'Departments', icon: Building2 },
  { path: '/admin/employees', label: 'Employees', icon: Users },
  { path: '/admin/invoices', label: 'Documents', icon: FileText },
  { path: '/admin/cases', label: 'Invoice Cases', icon: FileStack },
  { path: '/admin/upload', label: 'Upload', icon: Upload },
];

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isDocumentsPage = location.pathname === '/admin/invoices';

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <nav className="mt-5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1
                    ${isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
                {isActive && isDocumentsPage && (
                  <div className="px-2 py-2 mb-2">
                    <DocumentProcessingStatus />
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-100 p-8">
        {children}
      </div>
    </div>
  );
};