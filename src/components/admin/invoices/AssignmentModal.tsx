import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useDepartments } from '../../../hooks/useDepartments';
import { useEmployees } from '../../../hooks/useEmployees';
import toast from 'react-hot-toast';

interface Assignment {
  departmentId: string;
  employeeId: string;
}

interface AssignmentModalProps {
  documentId: string;
  onClose: () => void;
  onAssign: (assignments: Assignment[]) => Promise<void>;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({ 
  documentId, 
  onClose,
  onAssign 
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([{ departmentId: '', employeeId: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { departments, isLoading: isDepartmentsLoading } = useDepartments();
  const { employees, isLoading: isEmployeesLoading } = useEmployees();

  const addAssignment = () => {
    setAssignments([...assignments, { departmentId: '', employeeId: '' }]);
  };

  const removeAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const updateAssignment = (index: number, field: keyof Assignment, value: string) => {
    const newAssignments = [...assignments];
    newAssignments[index] = { 
      ...newAssignments[index],
      [field]: value,
      // Reset employee if department changes
      ...(field === 'departmentId' ? { employeeId: '' } : {})
    };
    setAssignments(newAssignments);
  };

  const validateAssignments = (): boolean => {
    // Check for empty fields
    if (assignments.some(a => !a.departmentId || !a.employeeId)) {
      toast.error('Please fill in all fields');
      return false;
    }

    // Check for duplicates
    const seen = new Set<string>();
    for (const { departmentId, employeeId } of assignments) {
      const key = `${departmentId}-${employeeId}`;
      if (seen.has(key)) {
        toast.error('Duplicate department and employee assignments are not allowed');
        return false;
      }
      seen.add(key);
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAssignments()) return;

    setIsSubmitting(true);
    try {
      await onAssign(assignments);
      onClose();
    } catch (error: any) {
      console.error('Assignment error:', error);
      toast.error(error.message || 'Failed to assign invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium">Assign Invoice</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {assignments.map((assignment, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      value={assignment.departmentId}
                      onChange={(e) => updateAssignment(index, 'departmentId', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      disabled={isDepartmentsLoading}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee</label>
                    <select
                      value={assignment.employeeId}
                      onChange={(e) => updateAssignment(index, 'employeeId', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      disabled={isEmployeesLoading || !assignment.departmentId}
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees
                        .filter(emp => emp.department_id === assignment.departmentId)
                        .map((emp) => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>
                  </div>
                </div>

                {assignments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAssignment(index)}
                    className="mt-6 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addAssignment}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Another Assignment
            </button>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};