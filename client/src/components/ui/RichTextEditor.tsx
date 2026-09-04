import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Palette,
  Highlighter,
  Undo,
  Redo,
  Eye,
  UploadCloud,
  Loader2,
  Trash2,
  Plus,
  PlusCircle,
  FileImage,
  Check
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './button';
import api from '../../lib/axios';
import { getMediaUrl, handleImageLoadError } from '@/utils/mediaUtils';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  label?: string;
  placeholder?: string;
}

function sanitizeUrl(url: string): string {
  const trimmed = (url || '').trim();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return '#';
  }
  return trimmed;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const TEXT_COLORS = [
  { name: 'Default', value: '' },
  { name: 'Brand Blue', value: '#0284c7' },
  { name: 'Slate Dark', value: '#0f172a' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Purple', value: '#9333ea' }
];

const HIGHLIGHT_COLORS = [
  { name: 'None', value: '' },
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Pink', value: '#fbcfe8' }
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = 'Full Article Content *',
  placeholder = 'Write blog content here...'
}) => {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value || '');

  // Hyperlink Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);

  // Image Modal State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'library' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageAlign, setImageAlign] = useState<'left' | 'center' | 'right'>('center');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [mediaLibraryFiles, setMediaLibraryFiles] = useState<any[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  // Table Modal State
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);

  // Color Pickers State
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const savedSelectionRef = useRef<{ from: number; to: number } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'article-inline-img'
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'article-table border-collapse border border-slate-300 my-4 w-full'
        }
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'editor-hyperlink'
        }
      })
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlSource(html);
      onChange(html);
    }
  });

  // Synchronize initial content from parent form
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentHtml = editor.getHTML();
      if (value !== currentHtml && value !== htmlSource) {
        editor.commands.setContent(value || '<p></p>');
        setHtmlSource(value || '');
      }
    }
  }, [value, editor]);

  const toggleSourceMode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSourceMode) {
      if (editor) {
        editor.commands.setContent(htmlSource || '<p></p>');
        onChange(htmlSource);
      }
      setIsSourceMode(false);
    } else {
      if (editor) {
        const currentHtml = editor.getHTML();
        setHtmlSource(currentHtml);
      }
      setIsSourceMode(true);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlSource(val);
    onChange(val);
  };

  // HYPERLINK HANDLERS
  const openLinkModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editor) return;

    const { from, to } = editor.state.selection;
    savedSelectionRef.current = { from, to };

    const previousUrl = editor.getAttributes('link').href || '';
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    setLinkUrl(previousUrl || 'https://');
    setLinkText(selectedText || '');
    const isLinkActive = editor.isActive('link');
    const existingTarget = editor.getAttributes('link').target;
    setOpenInNewTab(isLinkActive ? existingTarget === '_blank' : true);
    setIsLinkModalOpen(true);
  };

  const applyLink = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!editor) return;

    const cleanUrl = sanitizeUrl(linkUrl);

    if (savedSelectionRef.current) {
      const { from, to } = savedSelectionRef.current;
      editor.chain().focus().setTextSelection({ from, to }).run();
    }

    if (!cleanUrl || cleanUrl === '#') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const linkAttributes: any = { href: cleanUrl };
      if (openInNewTab) {
        linkAttributes.target = '_blank';
        linkAttributes.rel = 'noopener noreferrer';
      }

      const sel = savedSelectionRef.current || editor.state.selection;
      const isSelectionEmpty = sel.from === sel.to;
      const originalSelectedText = isSelectionEmpty ? '' : editor.state.doc.textBetween(sel.from, sel.to, ' ');

      if (isSelectionEmpty) {
        const displayText = escapeHtml(linkText || cleanUrl);
        const targetAttr = openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${escapeHtml(cleanUrl)}" ${targetAttr}>${displayText}</a>`)
          .run();
      } else if (linkText && linkText !== originalSelectedText) {
        const displayText = escapeHtml(linkText);
        const targetAttr = openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
        editor
          .chain()
          .focus()
          .setTextSelection({ from: sel.from, to: sel.to })
          .insertContent(`<a href="${escapeHtml(cleanUrl)}" ${targetAttr}>${displayText}</a>`)
          .run();
      } else {
        editor
          .chain()
          .focus()
          .setTextSelection({ from: sel.from, to: sel.to })
          .extendMarkRange('link')
          .setLink(linkAttributes)
          .run();
      }
    }

    setIsLinkModalOpen(false);
    const updatedHtml = editor.getHTML();
    setHtmlSource(updatedHtml);
    onChange(updatedHtml);
  };

  const removeLink = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (editor) {
      if (savedSelectionRef.current) {
        const { from, to } = savedSelectionRef.current;
        editor.chain().focus().setTextSelection({ from, to }).extendMarkRange('link').unsetLink().run();
      } else {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      }
      const updatedHtml = editor.getHTML();
      setHtmlSource(updatedHtml);
      onChange(updatedHtml);
    }
    setIsLinkModalOpen(false);
  };

  // IMAGE HANDLERS
  const openImageModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setImageAlign('center');
    setIsImageModalOpen(true);
    fetchMediaLibrary();
  };

  const fetchMediaLibrary = async () => {
    try {
      setIsLoadingMedia(true);
      const { data } = await api.get('/media');
      setMediaLibraryFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load media library:', err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload', formData);
      const uploadedUrl = data?.url || data?.data?.url;
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      } else {
        alert('Upload succeeded but no image URL was returned');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Image upload failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const insertImageToEditor = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editor || !imageUrl) {
      alert('Please select or upload an image first');
      return;
    }

    const alignClass = imageAlign === 'left' ? 'img-align-left' : imageAlign === 'right' ? 'img-align-right' : 'img-align-center';
    
    if (imageCaption && imageCaption.trim()) {
      const figureHtml = `<figure class="${alignClass}"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(imageAlt || 'Article Image')}" /><figcaption>${escapeHtml(imageCaption.trim())}</figcaption></figure>`;
      editor.chain().focus().insertContent(figureHtml).run();
    } else {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt || 'Article Image', title: imageAlt || '' }).run();
    }

    setIsImageModalOpen(false);
    const updatedHtml = editor.getHTML();
    setHtmlSource(updatedHtml);
    onChange(updatedHtml);
  };

  // TABLE HANDLERS
  const openTableModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTableRows(3);
    setTableCols(3);
    setWithHeaderRow(true);
    setIsTableModalOpen(true);
  };

  const insertTableToEditor = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editor) return;

    editor
      .chain()
      .focus()
      .insertTable({
        rows: Math.max(1, tableRows),
        cols: Math.max(1, tableCols),
        withHeaderRow: withHeaderRow
      })
      .run();

    setIsTableModalOpen(false);
    const updatedHtml = editor.getHTML();
    setHtmlSource(updatedHtml);
    onChange(updatedHtml);
  };

  if (!editor && !isSourceMode) {
    return null;
  }

  const isInsideTable = editor?.isActive('table');

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-primary/50 shadow-sm">

        {/* Editor Sticky Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-20">
          {!isSourceMode && editor && (
            <>
              {/* Bold, Italic, Underline, Strike */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Underline (Ctrl+U)"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive('strike') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              {/* Headings H1 - H6 & Paragraph */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
                className={`px-2 py-1 text-xs font-bold rounded transition-colors flex items-center gap-0.5 ${editor.isActive('heading', { level: 1 }) ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Heading 1"
              >
                <Heading1 className="w-3.5 h-3.5" /> H1
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
                className={`px-2 py-1 text-xs font-bold rounded transition-colors flex items-center gap-0.5 ${editor.isActive('heading', { level: 2 }) ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Heading 2"
              >
                <Heading2 className="w-3.5 h-3.5" /> H2
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
                className={`px-2 py-1 text-xs font-bold rounded transition-colors flex items-center gap-0.5 ${editor.isActive('heading', { level: 3 }) ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Heading 3"
              >
                <Heading3 className="w-3.5 h-3.5" /> H3
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 4 }).run(); }}
                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${editor.isActive('heading', { level: 4 }) ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Heading 4"
              >
                H4
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 5 }).run(); }}
                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${editor.isActive('heading', { level: 5 }) ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Heading 5"
              >
                H5
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 6 }).run(); }}
                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${editor.isActive('heading', { level: 6 }) ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Heading 6"
              >
                H6
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().setParagraph().run(); }}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${editor.isActive('paragraph') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Paragraph"
              >
                P
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              {/* Text Alignments */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('left').run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('center').run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('right').run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              {/* Lists, Quote, Code, Horizontal Rule */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Blockquote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive('codeBlock') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().setHorizontalRule().run(); }}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
                title="Horizontal Divider Line"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              {/* Text Color & Highlight Pickers */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }}
                  className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                  title="Text Color"
                >
                  <Palette className="w-4 h-4 text-brand-primary" />
                </button>
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg p-2 z-30 flex gap-1.5">
                    {TEXT_COLORS.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (c.value) editor.chain().focus().setColor(c.value).run();
                          else editor.chain().focus().unsetColor().run();
                          setShowColorPicker(false);
                        }}
                        className="w-6 h-6 rounded-full border border-slate-300 hover:scale-110 transition-transform flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: c.value || '#ffffff' }}
                        title={c.name}
                      >
                        {!c.value && '×'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }}
                  className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                  title="Text Highlight Color"
                >
                  <Highlighter className="w-4 h-4 text-amber-500" />
                </button>
                {showHighlightPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg p-2 z-30 flex gap-1.5">
                    {HIGHLIGHT_COLORS.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (c.value) editor.chain().focus().setHighlight({ color: c.value }).run();
                          else editor.chain().focus().unsetHighlight().run();
                          setShowHighlightPicker(false);
                        }}
                        className="w-6 h-6 rounded-full border border-slate-300 hover:scale-110 transition-transform flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: c.value || '#ffffff' }}
                        title={c.name}
                      >
                        {!c.value && '×'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              {/* Image Manager Modal Trigger */}
              <button
                type="button"
                onClick={openImageModal}
                className="p-1.5 rounded hover:bg-slate-200 text-brand-primary transition-colors flex items-center gap-1 text-xs font-bold"
                title="Insert Image (Upload / Media Library / URL)"
              >
                <ImageIcon className="w-4 h-4" /> Image
              </button>

              {/* Table Manager Trigger */}
              <button
                type="button"
                onClick={openTableModal}
                className={`p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold ${isInsideTable ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-800'}`}
                title="Insert Editable Table"
              >
                <TableIcon className="w-4 h-4" /> Table
              </button>

              {/* Hyperlink Controls */}
              <button
                type="button"
                onClick={openLinkModal}
                className={`p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold ${editor.isActive('link') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-brand-primary'}`}
                title="Insert / Edit Hyperlink"
              >
                <LinkIcon className="w-4 h-4" /> Link
              </button>
              {editor.isActive('link') && (
                <button
                  type="button"
                  onClick={removeLink}
                  className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Remove Link"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              )}

              <div className="w-px h-5 bg-slate-300 mx-1" />

              {/* Undo / Redo */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
                disabled={!editor.can().undo()}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition-colors"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
                disabled={!editor.can().redo()}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition-colors"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
            </>
          )}

          {/* HTML Source Toggle Button */}
          <button
            type="button"
            onClick={toggleSourceMode}
            className={`p-1.5 px-2.5 rounded text-xs font-bold transition-colors flex items-center gap-1 ml-auto ${isSourceMode ? 'bg-slate-900 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
            title={isSourceMode ? 'Switch to Visual Editor' : 'Switch to HTML Code View'}
          >
            {isSourceMode ? (
              <>
                <Eye className="w-3.5 h-3.5 text-brand-primary" /> Visual View
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5 text-brand-primary" /> &lt;/&gt; HTML Source
              </>
            )}
          </button>
        </div>

        {/* Table Operations Contextual Toolbar (Visible when cursor inside a table) */}
        {!isSourceMode && editor && isInsideTable && (
          <div className="bg-sky-50 border-b border-sky-200 px-3 py-1.5 flex flex-wrap items-center gap-2 text-xs font-medium text-sky-900">
            <span className="font-bold flex items-center gap-1 text-sky-700">
              <TableIcon className="w-3.5 h-3.5" /> Table Options:
            </span>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); editor.chain().focus().addRowBefore().run(); }}
              className="px-2 py-0.5 bg-white border border-sky-200 rounded hover:bg-sky-100 transition-colors"
            >
              + Row Above
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); editor.chain().focus().addRowAfter().run(); }}
              className="px-2 py-0.5 bg-white border border-sky-200 rounded hover:bg-sky-100 transition-colors"
            >
              + Row Below
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); editor.chain().focus().deleteRow().run(); }}
              className="px-2 py-0.5 bg-white border border-rose-200 text-rose-700 rounded hover:bg-rose-50 transition-colors"
            >
              - Delete Row
            </button>

            <div className="w-px h-4 bg-sky-200" />

            <button
              type="button"
              onClick={(e) => { e.preventDefault(); editor.chain().focus().addColumnBefore().run(); }}
              className="px-2 py-0.5 bg-white border border-sky-200 rounded hover:bg-sky-100 transition-colors"
            >
              + Col Left
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); editor.chain().focus().addColumnAfter().run(); }}
              className="px-2 py-0.5 bg-white border border-sky-200 rounded hover:bg-sky-100 transition-colors"
            >
              + Col Right
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); editor.chain().focus().deleteColumn().run(); }}
              className="px-2 py-0.5 bg-white border border-rose-200 text-rose-700 rounded hover:bg-rose-50 transition-colors"
            >
              - Delete Col
            </button>

            <div className="w-px h-4 bg-sky-200" />

            <button
              type="button"
              onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeaderRow().run(); }}
              className="px-2 py-0.5 bg-white border border-sky-200 rounded hover:bg-sky-100 transition-colors"
            >
              Toggle Header
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); editor.chain().focus().deleteTable().run(); }}
              className="px-2 py-0.5 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors font-bold ml-auto"
            >
              Delete Table
            </button>
          </div>
        )}

        {/* Editor Body Container */}
        {isSourceMode ? (
          <textarea
            value={htmlSource}
            onChange={handleSourceChange}
            rows={22}
            placeholder="Edit raw HTML source code here..."
            className="w-full p-4 font-mono text-xs bg-slate-900 text-slate-100 caret-white selection:bg-brand-primary selection:text-white outline-none leading-relaxed min-h-[620px] max-h-[750px] overflow-y-auto block resize-y border-none"
          />
        ) : (
          <div className="min-h-[620px] max-h-[750px] overflow-y-auto text-sm text-slate-800 leading-relaxed prose max-w-none bg-white">
            {editor && <EditorContent editor={editor} className="tiptap" />}
          </div>
        )}
      </div>

      {/* Image Manager Dialog Modal */}
      <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} title="Insert Article Image">
        <div className="space-y-4">
          <div className="flex border-b border-slate-200 gap-4">
            <button
              type="button"
              onClick={() => setImageTab('upload')}
              className={`pb-2 text-sm font-bold border-b-2 flex items-center gap-1.5 transition-colors ${imageTab === 'upload' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500'}`}
            >
              <UploadCloud className="w-4 h-4" /> Upload Direct
            </button>
            <button
              type="button"
              onClick={() => setImageTab('library')}
              className={`pb-2 text-sm font-bold border-b-2 flex items-center gap-1.5 transition-colors ${imageTab === 'library' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500'}`}
            >
              <FileImage className="w-4 h-4" /> Media Library
            </button>
            <button
              type="button"
              onClick={() => setImageTab('url')}
              className={`pb-2 text-sm font-bold border-b-2 flex items-center gap-1.5 transition-colors ${imageTab === 'url' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500'}`}
            >
              <LinkIcon className="w-4 h-4" /> Image URL
            </button>
          </div>

          {imageTab === 'upload' && (
            <div>
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-4 pb-4">
                  {isUploadingImage ? (
                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-2" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                  )}
                  <p className="text-sm font-medium text-slate-600">
                    {isUploadingImage ? 'Uploading image...' : 'Click to upload image file'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP (Max 5MB)</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" disabled={isUploadingImage} />
              </label>
            </div>
          )}

          {imageTab === 'library' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Select an existing image from Media Library:</label>
              {isLoadingMedia ? (
                <div className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" /></div>
              ) : mediaLibraryFiles.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No images found in Media Library.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-lg">
                  {mediaLibraryFiles.map((m: any) => {
                    const isSelected = imageUrl === m.url;
                    return (
                      <div
                        key={m._id}
                        onClick={() => setImageUrl(m.url)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${isSelected ? 'border-brand-primary ring-2 ring-brand-primary/30' : 'border-slate-200 hover:border-slate-400'}`}
                      >
                        <img src={getMediaUrl(m.url)} alt={m.filename} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-brand-primary/20 flex items-center justify-center">
                            <Check className="w-6 h-6 text-white drop-shadow-md" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {imageTab === 'url' && (
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-700">Image Source URL *</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-brand-primary/50 outline-none font-mono"
              />
            </div>
          )}

          {imageUrl && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex gap-3 items-center">
                <img src={getMediaUrl(imageUrl)} alt="Selected preview" className="w-16 h-16 object-cover rounded-lg border border-slate-200 bg-white" />
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Selected Image</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{imageUrl}</p>
                </div>
                <button type="button" onClick={() => setImageUrl('')} className="p-1 text-slate-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-700">Alt Text (Accessibility)</label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="e.g. Feline Abdominal Scan"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-700">Image Alignment</label>
                  <select
                    value={imageAlign}
                    onChange={(e: any) => setImageAlign(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white outline-none"
                  >
                    <option value="center">Center Block</option>
                    <option value="left">Float Left</option>
                    <option value="right">Float Right</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-slate-700">Image Caption (Optional)</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="e.g. Figure 1.1: Sagittal cross-section view of the kidney"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs outline-none"
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsImageModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={insertImageToEditor} disabled={!imageUrl}>
              Insert Image
            </Button>
          </div>
        </div>
      </Modal>

      {/* Table Generator Modal */}
      <Modal isOpen={isTableModalOpen} onClose={() => setIsTableModalOpen(false)} title="Insert Custom Table">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-700">Rows Count</label>
              <input
                type="number"
                min={1}
                max={20}
                value={tableRows}
                onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-700">Columns Count</label>
              <input
                type="number"
                min={1}
                max={15}
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="withHeaderRow"
              checked={withHeaderRow}
              onChange={(e) => setWithHeaderRow(e.target.checked)}
              className="rounded text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="withHeaderRow" className="text-xs font-medium text-slate-700 cursor-pointer">
              Include styled Header Row (`&lt;th&gt;`)
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsTableModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={insertTableToEditor}>
              Insert {tableRows}x{tableCols} Table
            </Button>
          </div>
        </div>
      </Modal>

      {/* Link Dialog Modal */}
      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title={editor?.isActive('link') ? 'Edit Existing Hyperlink' : 'Insert Hyperlink'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Link URL *</label>
            <input
              type="text"
              required
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com or /blog/article-slug"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none font-mono"
            />
            <p className="text-xs text-slate-400 mt-1">Supports external URLs (https://...) and internal paths (/blog/..., /programs/...)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Link Display Text</label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="e.g. Learn More"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="openInNewTab"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="openInNewTab" className="text-sm text-slate-700 font-medium cursor-pointer">
              Open link in new tab (`target="_blank" rel="noopener noreferrer"`)
            </label>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-slate-100">
            {editor?.isActive('link') ? (
              <Button type="button" variant="outline" onClick={removeLink} className="text-red-600 border-red-200 hover:bg-red-50">
                Remove Link
              </Button>
            ) : <div />}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsLinkModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={applyLink}>
                {editor?.isActive('link') ? 'Update Link' : 'Insert Link'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

