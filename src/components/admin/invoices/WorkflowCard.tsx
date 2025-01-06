import React from 'react';
import { Clock, CheckCircle, XCircle, UserCheck, Building2, MessageSquare } from 'lucide-react';
import { formatDate } from '../../../utils/date';

interface WorkflowCardProps {
  status: 'pending' | 'approved' | 'rejected';
  departmentName: string;
  employeeName: string;
  assignedAt: string;
  comments?: string[];
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  status,
  departmentName,
  employeeName,
  assignedAt,
  comments = []
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Workflow</h3>
      
      {/* Status Badge */}
      <div className="flex items-center mb-4">
        <StatusBadge status={status} />
      </div>

      {/* Assignment Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Building2 className="h-4 w-4" />
          <span className="text-sm">Department: <span className="font-medium">{departmentName}</span></span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <UserCheck className="h-4 w-4" />
          <span className="text-sm">Assigned to: <span className="font-medium">{employeeName}</span></span>
        </div>
        <div className="text-sm text-gray-500">
          Assigned on {formatDate(assignedAt)}
        </div>
      </div>

      {/* Comments Section */}
      {comments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Comments</h4>
          <div className="space-y-2">
            {comments.map((comment, index) => (
              <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {comment}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          text: 'Approved',
          className: 'bg-green-100 text-green-800'
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Rejected',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: Clock,
          text: 'Pending',
          className: 'bg-yellow-100 text-yellow-800'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      <Icon className="h-4 w-4 mr-1.5" />
      {config.text}
    </div>
  );
};