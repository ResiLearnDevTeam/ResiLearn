'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface ColorRow {
  color: string;
  colorName: string;
  firstBand: string;
  secondBand: string;
  thirdBand: string;
}

interface InteractiveColorTableProps {
  headers: string[];
  rows: string[][];
}

const colorMap: { [key: string]: string } = {
  'Black (ดำ)': '#000000',
  'Brown (น้ำตาล)': '#8B4513',
  'Red (แดง)': '#DC143C',
  'Orange (ส้ม)': '#FF6600',
  'Yellow (เหลือง)': '#FFD700',
  'Green (เขียว)': '#008000',
  'Blue (น้ำเงิน)': '#0000FF',
  'Violet (ม่วง)': '#8B00FF',
  'Grey (เทา)': '#808080',
  'Grey (เทา)': '#808080',
  'White (ขาว)': '#FFFFFF',
};

export default function InteractiveColorTable({ headers, rows }: InteractiveColorTableProps) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const getColorCode = (colorText: string): string => {
    // Extract color name from text like "Black (ดำ)" or "Brown (น้ำตาล)"
    const colorName = colorText.split(' (')[0];
    return colorMap[colorText] || colorMap[colorName] || '#CCCCCC';
  };

  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortColumn !== null) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn] || '';
        const bVal = b[sortColumn] || '';
        const comparison = aVal.localeCompare(bVal, 'th', { numeric: true });
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [rows, searchTerm, sortColumn, sortDirection]);

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 my-6">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ค้นหาสี..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <button
          onClick={() => {
            setSearchTerm('');
            setSortColumn(null);
            setSelectedRow(null);
          }}
          className="rounded-lg border border-slate-300 bg-white px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base text-slate-700 hover:bg-slate-50 transition-colors"
        >
          รีเซ็ต
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-left">
          <thead className="bg-slate-50">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 md:px-6 py-4 text-sm md:text-base font-semibold uppercase tracking-wide text-slate-700"
                >
                  <button
                    onClick={() => handleSort(idx)}
                    className="flex items-center gap-2 hover:text-orange-600 transition-colors"
                  >
                    {header}
                    {sortColumn === idx && (
                      <span className="text-orange-600 text-lg">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredAndSortedRows.map((row, rowIdx) => {
              const isSelected = selectedRow === rowIdx;
              const firstCell = row[0] || '';
              const colorCode = getColorCode(firstCell);
              const isLightColor = ['Yellow', 'White'].some(c => firstCell.includes(c));

              return (
                <motion.tr
                  key={rowIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIdx * 0.02 }}
                  onClick={() => setSelectedRow(isSelected ? null : rowIdx)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-orange-50 ring-2 ring-orange-500'
                      : 'hover:bg-orange-50/40'
                  }`}
                >
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 md:px-6 py-4">
                      {cellIdx === 0 ? (
                        <div className="flex items-center gap-3 md:gap-4">
                          <div
                            className={`h-10 w-10 md:h-12 md:w-12 rounded-lg shadow-md flex-shrink-0 ${
                              isLightColor ? 'border-2 border-slate-300' : ''
                            }`}
                            style={{ backgroundColor: colorCode }}
                          />
                          <span className="text-sm md:text-base font-medium text-slate-900 leading-relaxed">{cell}</span>
                        </div>
                      ) : (
                        <span className={`text-sm md:text-base leading-relaxed ${
                          isSelected ? 'font-semibold text-orange-700' : 'text-slate-700'
                        }`}>
                          {cell}
                        </span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAndSortedRows.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          ไม่พบข้อมูลที่ค้นหา
        </div>
      )}
    </div>
  );
}
