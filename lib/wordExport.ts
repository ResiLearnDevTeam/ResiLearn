import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { sanitizeHtml } from './sanitizeHtml';

/**
 * Convert HTML content to Word document
 * @param title - Announcement title
 * @param htmlContent - HTML content from rich text editor
 * @returns Blob of Word document
 */
export async function exportToWord(title: string, htmlContent: string): Promise<Blob> {
  // Sanitize HTML first
  const sanitized = sanitizeHtml(htmlContent);
  
  const paragraphs: Paragraph[] = [];
  
  // Add title as heading
  paragraphs.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    })
  );
  
  // Simple HTML to text conversion with basic formatting
  // Remove HTML tags and extract text, preserving basic structure
  let textContent = sanitized
    .replace(/<h[1-6][^>]*>/gi, '\n###HEADING###\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/<strong[^>]*>|<\/strong>|<b[^>]*>|<\/b>/gi, '**')
    .replace(/<em[^>]*>|<\/em>|<i[^>]*>|<\/i>/gi, '*')
    .replace(/<u[^>]*>|<\/u>/gi, '__')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  // Split by double newlines to get paragraphs
  const textParagraphs = textContent.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  // Convert to Word paragraphs
  textParagraphs.forEach(text => {
    const trimmed = text.trim();
    if (trimmed.startsWith('###HEADING###')) {
      // Heading
      const headingText = trimmed.replace(/###HEADING###/g, '').trim();
      if (headingText) {
        paragraphs.push(
          new Paragraph({
            text: headingText,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 180 },
          })
        );
      }
    } else {
      // Regular paragraph
      // Handle bold, italic, underline markers
      const runs: TextRun[] = [];
      let currentText = '';
      let isBold = false;
      let isItalic = false;
      let isUnderline = false;
      
      for (let i = 0; i < trimmed.length; i++) {
        const char = trimmed[i];
        const nextTwo = trimmed.substring(i, i + 2);
        const nextThree = trimmed.substring(i, i + 2);
        
        if (nextTwo === '**') {
          if (currentText) {
            runs.push(new TextRun({
              text: currentText,
              bold: isBold,
              italics: isItalic,
              underline: isUnderline ? {} : undefined,
            }));
            currentText = '';
          }
          isBold = !isBold;
          i++; // Skip next character
        } else if (char === '*' && !isBold) {
          if (currentText) {
            runs.push(new TextRun({
              text: currentText,
              bold: isBold,
              italics: isItalic,
              underline: isUnderline ? {} : undefined,
            }));
            currentText = '';
          }
          isItalic = !isItalic;
        } else if (nextTwo === '__') {
          if (currentText) {
            runs.push(new TextRun({
              text: currentText,
              bold: isBold,
              italics: isItalic,
              underline: isUnderline ? {} : undefined,
            }));
            currentText = '';
          }
          isUnderline = !isUnderline;
          i++; // Skip next character
        } else {
          currentText += char;
        }
      }
      
      // Add remaining text
      if (currentText) {
        runs.push(new TextRun({
          text: currentText,
          bold: isBold,
          italics: isItalic,
          underline: isUnderline ? {} : undefined,
        }));
      }
      
      paragraphs.push(
        new Paragraph({
          children: runs.length > 0 ? runs : [new TextRun(trimmed)],
          spacing: { after: 120 },
        })
      );
    }
  });
  
  // If no content paragraphs, add empty one
  if (paragraphs.length === 1) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun('')],
      })
    );
  }
  
  // Create document
  const docx = new Document({
    sections: [
      {
        children: paragraphs,
      },
    ],
  });
  
  // Generate blob
  const blob = await Packer.toBlob(docx);
  return blob;
}

/**
 * Download Word document (client-side only)
 * @param blob - Word document blob
 * @param filename - Filename for download
 */
export function downloadWord(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') {
    console.error('downloadWord can only be called on the client side');
    return;
  }
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
