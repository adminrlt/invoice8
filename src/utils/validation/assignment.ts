import { validate as isValidUUID } from 'uuid';

export const validateAssignmentData = (
  departmentId: string | undefined,
  employeeId: string | undefined
): boolean => {
  if (!departmentId || !employeeId) return false;
  return isValidUUID(departmentId) && isValidUUID(employeeId);
};