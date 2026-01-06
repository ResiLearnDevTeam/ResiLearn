interface ImagePlaceholderProps {
  width?: string;
  height?: string;
  aspectRatio?: string;
  description?: string;
  className?: string;
}

export default function ImagePlaceholder({
  width = 'w-full',
  height = 'h-full',
  aspectRatio,
  description = 'Image Placeholder',
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`
        ${width} ${height}
        ${aspectRatio || ''}
        border-2 border-gray-300
        bg-gray-100
        rounded-lg
        flex items-center justify-center
        text-gray-500 text-sm font-medium
        ${className}
      `}
    >
      {description}
    </div>
  );
}

