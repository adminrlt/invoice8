import React from 'react';
import { FileCheck, Clock, XCircle } from 'lucide-react';
import type { InvoiceStats as Stats } from '../../../types/dashboard';

interface InvoiceStatsProps {
  stats: Stats;
}

export const InvoiceStats: React.FC<InvoiceStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-yellow-500" />
          <div className="ml-4">
            <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            <p className="text-sm text-gray-500">Pending Review</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <FileCheck className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
            <p className="text-sm text-gray-500">Approved</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <XCircle className="h-8 w-8 text-red-500" />
          <div className="ml-4">
            <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>
        </div>
      </div>
    </div>
  );
};