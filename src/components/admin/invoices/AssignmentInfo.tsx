import React from 'react';
import { UserCheck, Building2, Clock } from 'lucide-react';
import { formatDate } from '../../../utils/date';

interface AssignmentInfoProps {
  departmentName: string;
  employeeName: string;
  assignedAt: string;
  status: string;
}

export const AssignmentInfo: React.FC<AssignmentInfoProps> = ({
  departmentName,
  employeeName,
  assignedAt,
  status
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center text-gray-700 bg-gray-100 px-2 py-1 rounded">
          <Building2 className="h-4 w-4 mr-1.5 text-gray-600" />
          <span className="text-sm font-medium">{departmentName}</span>
        </div>
        <div className="flex items-center text-gray-700 bg-gray-100 px-2 py-1 rounded">
          <UserCheck className="h-4 w-4 mr-1.5 text-gray-600" />
          <span className="text-sm font-medium">{employeeName}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock className="h-3.5 w-3.5" />
        <span>Assigned {formatDate(assignedAt)}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
};