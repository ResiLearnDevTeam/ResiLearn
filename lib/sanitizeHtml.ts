/**
 * Sanitize HTML content to prevent XSS attacks
 * Works in both browser and Node.js environments
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // Basic sanitization - remove dangerous content
  let sanitized = html
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: URLs in img src (can be dangerous)
    .replace(/<img[^>]+src\s*=\s*["']data:/gi, '<img src=""');
  
  return sanitized;
}
