import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Unlink, 
  Undo, 
  Redo, 
  Code,
  Eye
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './button';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  label?: string;
  placeholder?: string;
}

function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
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

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = 'Full Article Content *',
  placeholder = 'Write blog content here...'
}) => {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value || '');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);

  const savedSelectionRef = useRef<{ from: number; to: number } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer'
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

  // Synchronize initial content from parent form without causing continuous re-renders
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

  const openLinkModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editor) return;

    // Preserve exact document selection range before focus shifts to the modal input
    const { from, to } = editor.state.selection;
    savedSelectionRef.current = { from, to };

    const previousUrl = editor.getAttributes('link').href || '';
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    setLinkUrl(previousUrl || 'https://');
    setLinkText(selectedText || '');
    setOpenInNewTab(editor.getAttributes('link').target === '_blank' || true);
    setIsLinkModalOpen(true);
  };

  const applyLink = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!editor) return;

    const cleanUrl = sanitizeUrl(linkUrl);

    // Restore saved document selection before executing Tiptap link commands
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
        // Insert new link with display text at cursor position
        const displayText = escapeHtml(linkText || cleanUrl);
        const targetAttr = openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${escapeHtml(cleanUrl)}" ${targetAttr}>${displayText}</a>`)
          .run();
      } else if (linkText && linkText !== originalSelectedText) {
        // Replace selection with updated link display text
        const displayText = escapeHtml(linkText);
        const targetAttr = openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
        editor
          .chain()
          .focus()
          .setTextSelection({ from: sel.from, to: sel.to })
          .insertContent(`<a href="${escapeHtml(cleanUrl)}" ${targetAttr}>${displayText}</a>`)
          .run();
      } else {
        // Wrap active selection in hyperlink mark
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

  if (!editor && !isSourceMode) {
    return null;
  }

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-primary/50">
        
        {/* Editor Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1 items-center">
          {!isSourceMode && editor && (
            <>
              {/* Bold, Italic, Underline */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
                className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Underline"
              >
                <UnderlineIcon className="w-4 h-4" />
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

              {/* Lists */}
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

              <div className="w-px h-5 bg-slate-300 mx-1" />

              {/* Hyperlink Controls */}
              <button
                type="button"
                onClick={openLinkModal}
                className={`p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold ${editor.isActive('link') ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 text-brand-primary'}`}
                title="Insert / Edit Link"
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
            className={`p-1.5 px-2.5 rounded text-xs font-bold transition-colors flex items-center gap-1 ml-auto ${
              isSourceMode ? 'bg-slate-900 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
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

        {/* Editor Body */}
        {isSourceMode ? (
          <textarea
            value={htmlSource}
            onChange={handleSourceChange}
            rows={12}
            placeholder="Edit raw HTML code..."
            className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-950 text-slate-100 outline-none leading-relaxed min-h-[220px] max-h-[450px]"
          />
        ) : (
          <div className="p-4 min-h-[220px] max-h-[450px] overflow-y-auto text-sm text-slate-800 leading-relaxed prose max-w-none">
            {editor && <EditorContent editor={editor} />}
          </div>
        )}
      </div>

      {/* Link Dialog Modal (Uses <div> container with type="button" actions to prevent page refreshes) */}
      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title={editor?.isActive('link') ? 'Edit Existing Hyperlink' : 'Insert Hyperlink'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Link URL *</label>
            <input
              type="text"
              required
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com or about.html#faculty"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none font-mono"
            />
            <p className="text-xs text-slate-400 mt-1">Supports external URLs (https://...) and internal links (about.html#faculty, programs-single.html, /contact.html).</p>
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
