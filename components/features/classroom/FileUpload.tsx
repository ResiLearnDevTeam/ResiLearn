'use client';

import { useState, useCallback } from 'react';
import { Upload, X, File, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface FileUploadProps {
  files: FileAttachment[];
  onFilesChange: (files: FileAttachment[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

export default function FileUpload({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `ไฟล์ ${file.name} มีขนาดเกิน ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `ไฟล์ ${file.name} ไม่ใช่ประเภทที่รองรับ`;
    }

    return null;
  };

  const handleFileUpload = useCallback(async (uploadedFiles: FileList | File[]) => {
    setError(null);
    
    const fileArray = Array.from(uploadedFiles);
    
    // Check max files
    if (files.length + fileArray.length > maxFiles) {
      setError(`สามารถอัปโหลดได้สูงสุด ${maxFiles} ไฟล์`);
      return;
    }

    setUploading(true);

    try {
      const newFiles: FileAttachment[] = [];

      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        // In a real implementation, upload file to server
        // For now, create a placeholder
        const fileAttachment: FileAttachment = {
          name: file.name,
          url: URL.createObjectURL(file), // Temporary URL, should upload to server
          type: file.type,
          size: file.size,
        };

        newFiles.push(fileAttachment);
      }

      if (newFiles.length > 0) {
        onFilesChange([...files, ...newFiles]);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
    } finally {
      setUploading(false);
    }
  }, [files, maxFiles, maxSize, acceptedTypes, onFilesChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  }, [handleFileUpload]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading || files.length >= maxFiles}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer flex flex-col items-center gap-3 ${
            uploading || files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className={`p-4 rounded-full ${
            isDragging ? 'bg-orange-100' : 'bg-gray-100'
          }`}>
            <Upload className={`h-6 w-6 ${
              isDragging ? 'text-orange-600' : 'text-gray-600'
            }`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {isDragging ? 'วางไฟล์ที่นี่' : 'ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              สูงสุด {maxFiles} ไฟล์, ไฟล์ละไม่เกิน {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">ไฟล์ที่แนบ ({files.length}/{maxFiles})</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                    <File className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-3 p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors flex-shrink-0"
                  title="ลบไฟล์"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
