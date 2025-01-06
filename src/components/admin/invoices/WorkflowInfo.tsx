import React from 'react';
import { Building2, UserCheck, Clock } from 'lucide-react';
import { formatDate } from '../../../utils/date';

interface WorkflowInfoProps {
  departmentName: string;
  employeeName: string;
  assignedAt: string;
  status: string;
}

export const WorkflowInfo: React.FC<WorkflowInfoProps> = ({
  departmentName,
  employeeName,
  assignedAt,
  status
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Details</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-gray-500" />
          <div>
            <div className="text-sm font-medium text-gray-900">Department</div>
            <div className="text-sm text-gray-600">{departmentName}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-gray-500" />
          <div>
            <div className="text-sm font-medium text-gray-900">Assigned To</div>
            <div className="text-sm text-gray-600">{employeeName}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <div>
            <div className="text-sm font-medium text-gray-900">Assignment Date</div>
            <div className="text-sm text-gray-600">{formatDate(assignedAt)}</div>
          </div>
        </div>

        <div className="mt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};