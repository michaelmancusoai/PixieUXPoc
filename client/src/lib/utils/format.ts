/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a currency value
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '$0.00';
  
  try {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '$0.00';
  }
}

/**
 * Format a phone number to (XXX) XXX-XXXX
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if we have exactly 10 digits (US phone number)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Return original format if not 10 digits
  return phone;
}

/**
 * Generate initials from a name (first letter of first and last name)
 */
export function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') return 'UU';
  
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'UU';
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}