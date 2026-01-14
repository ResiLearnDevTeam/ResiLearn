export const colorOptions = {
  digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'],
  multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue'],
  tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver']
};

export function getColorCode(color: string): string {
  const colorMap: { [key: string]: string } = {
    black: '#1a1a1a', brown: '#8B4513', red: '#DC143C', orange: '#FF6600',
    yellow: '#FFD700', green: '#228B22', blue: '#0066CC', violet: '#8B00FF',
    gray: '#808080', white: '#F5F5F5', gold: '#DAA520', silver: '#C0C0C0',
  };
  return colorMap[color.toLowerCase()] || '#CCCCCC';
}

export function getColorName(color: string): string {
  const nameMap: { [key: string]: string } = {
    black: 'ดำ', brown: 'น้ำตาล', red: 'แดง', orange: 'ส้ม',
    yellow: 'เหลือง', green: 'เขียว', blue: 'น้ำเงิน', violet: 'ม่วง',
    gray: 'เทา', white: 'ขาว', gold: 'ทอง', silver: 'เงิน',
  };
  return nameMap[color.toLowerCase()] || color;
}

export function getBandLabel(index: number, resistorType: string): string {
  const is5Band = resistorType === 'FIVE_BAND';
  if (is5Band) {
    if (index === 0) return 'หลักที่ 1';
    if (index === 1) return 'หลักที่ 2';
    if (index === 2) return 'หลักที่ 3';
    if (index === 3) return 'ตัวคูณ';
    if (index === 4) return 'ความคลาดเคลื่อน';
  } else {
    if (index === 0) return 'หลักที่ 1';
    if (index === 1) return 'หลักที่ 2';
    if (index === 2) return 'ตัวคูณ';
    if (index === 3) return 'ความคลาดเคลื่อน';
  }
  return '';
}

export function getAvailableColors(index: number, resistorType: string): string[] {
  const is5Band = resistorType === 'FIVE_BAND';
  if (is5Band) {
    if (index === 0) return colorOptions.digit.filter(c => c !== 'black');
    else if (index >= 1 && index <= 2) return colorOptions.digit;
    else if (index === 3) return colorOptions.multiplier;
    else if (index === 4) return colorOptions.tolerance;
  } else {
    if (index === 0) return colorOptions.digit.filter(c => c !== 'black');
    else if (index === 1) return colorOptions.digit;
    else if (index === 2) return colorOptions.multiplier;
    else if (index === 3) return colorOptions.tolerance;
  }
  return [];
}
