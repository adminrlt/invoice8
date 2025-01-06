import React from 'react';
import { CheckCircle, Clock, MessageSquare, AlertCircle } from 'lucide-react';

interface WorkflowStatusProps {
  status: 'pending' | 'approved' | 'rejected';
  comments?: string[];
  updatedAt?: string;
}

export const WorkflowStatus: React.FC<WorkflowStatusProps> = ({ 
  status, 
  comments = [],
  updatedAt
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        {updatedAt && (
          <span className="text-sm text-gray-500">
            Updated {new Date(updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {comments.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments
          </h4>
          <ul className="mt-2 space-y-2">
            {comments.map((comment, index) => (
              <li key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {comment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};