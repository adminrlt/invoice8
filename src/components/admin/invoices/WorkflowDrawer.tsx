import React from 'react';
import { X, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { formatDate } from '../../../utils/date';
import { createPortal } from 'react-dom';

interface WorkflowDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  workflowInfo: {
    departmentName: string;
    employeeName: string;
    assignedAt: string;
    status: string;
    comments?: string[];
  };
}

export const WorkflowDrawer: React.FC<WorkflowDrawerProps> = ({
  isOpen,
  onClose,
  workflowInfo
}) => {
  if (!isOpen) return null;

  const getStatusConfig = () => {
    switch (workflowInfo.status) {
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
          text: 'Pending Review',
          className: 'bg-yellow-100 text-yellow-800'
        };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  const drawer = (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md transform transition-transform duration-300 ease-in-out">
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            {/* Header */}
            <div className="sticky top-0 z-10 px-4 py-6 bg-white border-b border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Invoice Workflow</h2>
                <button
                  onClick={onClose}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative flex-1 px-4 py-6 sm:px-6">
              {/* Status Badge */}
              <div className="mb-6">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
                  <StatusIcon className="h-4 w-4 mr-1.5" />
                  {status.text}
                </div>
              </div>

              {/* Assignment Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900">{workflowInfo.departmentName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                    <dd className="mt-1 text-sm text-gray-900">{workflowInfo.employeeName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Assigned Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(workflowInfo.assignedAt)}</dd>
                  </div>
                </dl>
              </div>

              {/* Comments Section */}
              {workflowInfo.comments && workflowInfo.comments.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Comments
                  </h3>
                  <div className="space-y-3">
                    {workflowInfo.comments.map((comment, index) => (
                      <div 
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700"
                      >
                        {comment}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
};