'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  FileText,
  Download
} from 'lucide-react';
import { useState, useCallback } from 'react';

interface WordEditorProps {
  content: string;
  onChange: (html: string) => void;
  onExport?: () => void;
  placeholder?: string;
}

export default function WordEditor({ 
  content, 
  onChange, 
  onExport,
  placeholder = 'เริ่มพิมพ์ข้อความ...' 
}: WordEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      
      // Update word and character count
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(text.length);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link')?.href || '';
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt('URL รูปภาพ');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-300 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 p-3 rounded-t-xl">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-300' : ''
            }`}
            title="ตัวหนา (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-300' : ''
            }`}
            title="ตัวเอียง (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              // Basic underline using HTML
              const { from, to } = editor.state.selection;
              const text = editor.state.doc.textBetween(from, to);
              if (text) {
                editor.chain().focus().insertContent(`<u>${text}</u>`).run();
              }
            }}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="ขีดเส้นใต้"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('strike') ? 'bg-gray-300' : ''
            }`}
            title="ขีดฆ่า"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-300' : ''
            }`}
            title="รายการแบบจุด"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-300' : ''
            }`}
            title="รายการแบบเลข"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>

        {/* Insert */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('link') ? 'bg-gray-300' : ''
            }`}
            title="แทรกลิงก์"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="แทรกรูปภาพ"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="ยกเลิก (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="ทำซ้ำ (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        {/* Export */}
        {onExport && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onExport}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-blue-600"
              title="ส่งออกเป็น Word"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[300px]" />

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-2 rounded-b-xl text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>คำ: {wordCount}</span>
          <span>อักขระ: {charCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-3 w-3" />
          <span>Rich Text Editor</span>
        </div>
      </div>
    </div>
  );
}
