export const generateShortId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isDateExpired = (date: Date): boolean => {
  return new Date() > date;
};

export const generateQRCode = (data: string): string => {
  // In a real implementation, you would use a QR code library
  // For now, we'll return a simple encoded string
  return Buffer.from(data).toString('base64');
};
