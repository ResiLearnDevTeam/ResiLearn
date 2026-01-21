import mammoth from 'mammoth';

/**
 * Convert Word document to HTML
 * @param file - Word document file (.docx)
 * @returns HTML string
 */
export async function importFromWord(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    // Return HTML content
    return result.value;
  } catch (error) {
    console.error('Error importing Word document:', error);
    throw new Error('ไม่สามารถแปลงไฟล์ Word เป็น HTML ได้ กรุณาตรวจสอบว่าไฟล์เป็น .docx และไม่เสียหาย');
  }
}

/**
 * Validate Word file
 * @param file - File to validate
 * @returns true if valid, throws error if invalid
 */
export function validateWordFile(file: File): boolean {
  // Check file type
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];
  
  if (!validTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
    throw new Error('ไฟล์ต้องเป็น Word document (.docx หรือ .doc)');
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('ขนาดไฟล์ต้องไม่เกิน 5MB');
  }
  
  return true;
}
