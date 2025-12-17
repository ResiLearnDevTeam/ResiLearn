// Helper functions for translating technical terms to user-friendly Thai text

/**
 * Translate question type to user-friendly Thai text
 */
export function translateQuestionType(type: string): string {
  const translations: { [key: string]: string } = {
    'value_to_color_full': 'แบบ: สี→ค่า (เต็ม)',
    'value_to_color_band_by_band': 'แบบ: สี→ค่า (ทีละแถบ)',
    'color_to_value': 'แบบ: ค่า→สี',
    'normal': 'แบบปกติ',
    'mixed': 'แบบผสม',
    'color_to_value_full': 'แบบ: ค่า→สี (เต็ม)',
    'color_to_value_band_by_band': 'แบบ: ค่า→สี (ทีละแถบ)'
  };

  return translations[type.toLowerCase()] || type;
}

/**
 * Translate section titles to simpler Thai text
 */
export function translateSectionTitle(title: string): string {
  const translations: { [key: string]: string } = {
    'การวิเคราะห์เชิงลึกภาพรวม': 'สรุปผลการฝึกฝน',
    'สถิติภาพรวม': 'สถิติโดยรวม',
    'จุดอ่อนที่ควรฝึกฝน': 'จุดที่ควรฝึกเพิ่ม',
    'ภาพรวมความแม่นยำ': 'ความแม่นยำโดยรวม',
    'ความสับสนของสี': 'สีที่จำผิดบ่อย',
    'อัตราความผิดพลาดตามตำแหน่ง': 'ผิดบ่อยที่ตำแหน่งไหน',
    'เปรียบเทียบความแม่นยำตามประเภทคำถาม': 'เปรียบเทียบตามแบบคำถาม',
    'ค่าตัวต้านทานที่ทำผิดบ่อย': 'ค่าที่ผิดบ่อย',
    'สัดส่วนความผิดพลาดของความคลาดเคลื่อน': 'ความคลาดเคลื่อนที่ผิดบ่อย',
    'การวิเคราะห์เชิงลึก': 'สรุปผลการฝึกฝน'
  };

  return translations[title] || title;
}

/**
 * Translate weak area description to simpler text
 */
export function translateWeakAreaDescription(description: string): string {
  // Replace technical terms in descriptions
  let translated = description;
  
  // Replace question type patterns
  translated = translated.replace(/ประเภทคำถาม:\s*([^,]+)/g, (match, type) => {
    return `แบบคำถาม: ${translateQuestionType(type.trim())}`;
  });

  // Replace position patterns
  translated = translated.replace(/ตำแหน่ง\s*(position1|position2|position3|multiplier|tolerance)/g, (match, pos) => {
    const posMap: { [key: string]: string } = {
      'position1': 'หลักที่ 1',
      'position2': 'หลักที่ 2',
      'position3': 'หลักที่ 3',
      'multiplier': 'ตัวคูณ',
      'tolerance': 'ความคลาดเคลื่อน'
    };
    return `ตำแหน่ง ${posMap[pos] || pos}`;
  });

  return translated;
}

/**
 * Format error rate text
 */
export function formatErrorRateText(rate: number): string {
  return `ผิด ${rate.toFixed(1)}%`;
}

/**
 * Get simplified label for chart axes
 */
export function getSimplifiedLabel(label: string): string {
  const simplifications: { [key: string]: string } = {
    'อัตราความผิดพลาด': 'ผิดกี่เปอร์เซ็นต์',
    'จำนวนครั้งที่ผิด': 'ผิดกี่ครั้ง',
    'ความแม่นยำ': 'ถูกกี่เปอร์เซ็นต์',
    'จำนวน': 'จำนวน',
    'ถูกต้อง': 'ถูก',
    'ผิดพลาด': 'ผิด'
  };

  return simplifications[label] || label;
}

