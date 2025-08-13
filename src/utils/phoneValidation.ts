
// Phone number validation patterns for different countries
const phonePatterns = {
  // Common international patterns
  IN: /^(\+91|91)?[6-9]\d{9}$/, // India
  US: /^(\+1|1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/, // USA
  UK: /^(\+44|44)?[1-9]\d{8,9}$/, // UK
  AE: /^(\+971|971)?[2-9]\d{7}$/, // UAE
  SA: /^(\+966|966)?[1-9]\d{7,8}$/, // Saudi Arabia
  // Add more as needed
};

export const validatePhoneNumber = (phone: string): { isValid: boolean; country?: string } => {
  // Remove all spaces, hyphens, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check against each pattern
  for (const [country, pattern] of Object.entries(phonePatterns)) {
    if (pattern.test(cleanPhone)) {
      return { isValid: true, country };
    }
  }
  
  // Basic fallback - any number with 7-15 digits with optional country code
  const basicPattern = /^(\+\d{1,3})?\d{7,15}$/;
  return { isValid: basicPattern.test(cleanPhone) };
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all spaces, hyphens, and parentheses
  let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Ensure it starts with + for international format
  if (!cleanPhone.startsWith('+') && cleanPhone.length > 10) {
    // If it looks like it might be missing the +, add it
    if (cleanPhone.match(/^[1-9]\d{10,14}$/)) {
      cleanPhone = '+' + cleanPhone;
    }
  }
  
  return cleanPhone;
};
