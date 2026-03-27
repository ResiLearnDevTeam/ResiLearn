// Helper functions for translating technical terms to user-friendly Thai text

/**
 * Translate weak area type (group name) to Thai
 */
export function translateWeakAreaType(type: string): string {
  const translations: { [key: string]: string } = {
    'digit_position': 'ตำแหน่งแถบสี',
    'question_type': 'ประเภทคำถาม',
    'resistor_type': 'ประเภทตัวต้านทาน',
    'color': 'สี',
    'tolerance': 'ค่าความคลาดเคลื่อน',
    'multiplier': 'ตัวคูณ',
    'resistor_value': 'ค่าความต้านทาน'
  };

  return translations[type.toLowerCase()] || type;
}

/**
 * Translate question type to user-friendly Thai text
 */
export function translateQuestionType(type: string): string {
  const translations: { [key: string]: string } = {
    'value_to_color_full': 'ค่า→สี (เต็ม)',
    'value_to_color_band_by_band': 'ค่า→สี (ทีละแถบ)',
    'color_to_value': 'สี→ค่า',
    'normal': 'แบบปกติ',
    'mixed': 'แบบผสม',
    'color_to_value_full': 'สี→ค่า (เต็ม)',
    'color_to_value_band_by_band': 'สี→ค่า (ทีละแถบ)'
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
  
  // Clean up "แบบคำถาม: แบบ:" redundancy → just show the type
  translated = translated.replace(/แบบคำถาม:\s*แบบ:\s*/g, '');
  translated = translated.replace(/แบบคำถาม:\s*/g, '');
  
  // Replace question type patterns (English keys)
  const questionTypeMap: { [key: string]: string } = {
    'value_to_color_full': 'ค่า→สี (เต็ม)',
    'value_to_color_band_by_band': 'ค่า→สี (ทีละแถบ)',
    'color_to_value_full': 'สี→ค่า (เต็ม)',
    'color_to_value_band_by_band': 'สี→ค่า (ทีละแถบ)',
    'color_to_value': 'สี→ค่า',
    'normal': 'แบบปกติ',
    'mixed': 'แบบผสม'
  };
  
  Object.entries(questionTypeMap).forEach(([key, value]) => {
    translated = translated.replace(new RegExp(key, 'gi'), value);
  });

  // Replace position patterns - remove "ตำแหน่ง" prefix since already in group
  const posMap: { [key: string]: string } = {
    'position1': 'หลักที่ 1',
    'position2': 'หลักที่ 2',
    'position3': 'หลักที่ 3',
    'multiplier': 'ตัวคูณ',
    'tolerance': 'ค่าความคลาดเคลื่อน'
  };
  
  // Replace "ตำแหน่ง position1" → "หลักที่ 1"
  translated = translated.replace(/ตำแหน่ง\s*(position1|position2|position3|multiplier|tolerance)/gi, (match, pos) => {
    return posMap[pos.toLowerCase()] || pos;
  });
  
  // Also handle standalone position keys
  Object.entries(posMap).forEach(([key, value]) => {
    translated = translated.replace(new RegExp(`\\b${key}\\b`, 'gi'), value);
  });

  return translated.trim();
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

