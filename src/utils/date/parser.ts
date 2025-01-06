/**
 * Parses various date formats and returns ISO date string (YYYY-MM-DD)
 * Handles common formats:
 * - DD-MM-YYYY or DD/MM/YYYY (European)
 * - MM-DD-YYYY or MM/DD/YYYY (US)
 * - YYYY-MM-DD (ISO)
 */
export const parseDate = (dateStr: string | null): string | null => {
  if (!dateStr) return null;

  try {
    // Clean the input
    const cleaned = dateStr.trim();
    
    // Try parsing as ISO format first (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
      const [year, month, day] = cleaned.split('-').map(Number);
      if (isValidDateParts(year, month, day)) {
        return cleaned;
      }
    }
    
    // Handle European format (DD-MM-YYYY or DD/MM/YYYY)
    const europeanMatch = cleaned.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (europeanMatch) {
      const [_, day, month, year] = europeanMatch;
      if (isValidDateParts(Number(year), Number(month), Number(day))) {
        return `${year}-${padZero(month)}-${padZero(day)}`;
      }
    }
    
    // Handle US format (MM-DD-YYYY or MM/DD/YYYY)
    const usMatch = cleaned.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (usMatch) {
      const [_, month, day, year] = usMatch;
      if (isValidDateParts(Number(year), Number(month), Number(day))) {
        return `${year}-${padZero(month)}-${padZero(day)}`;
      }
    }

    return null;
  } catch (error) {
    console.error('Date parsing error:', error);
    return null;
  }
};

const isValidDateParts = (year: number, month: number, day: number): boolean => {
  // Check ranges
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Create date object and verify parts
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
         date.getMonth() === month - 1 &&
         date.getDate() === day;
};

const padZero = (num: string | number): string => {
  return num.toString().padStart(2, '0');
};

export const isValidDate = (dateStr: string): boolean => {
  return parseDate(dateStr) !== null;
};