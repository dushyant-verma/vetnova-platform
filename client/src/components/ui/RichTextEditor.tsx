import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Unlink, 
  RemoveFormatting
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './button';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  label?: string;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = 'Content',
  placeholder = 'Write blog content here...'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  // Initialize and sync HTML content without overriding cursor when typing
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatBlock = (tag: string) => {
    executeCommand('formatBlock', `<${tag}>`);
  };

  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelection(sel.getRangeAt(0).cloneRange());
    }
  };

  const restoreSelection = () => {
    if (savedSelection) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelection);
      }
    }
  };

  const openLinkDialog = () => {
    saveCurrentSelection();
    setLinkUrl('https://');
    setOpenInNewTab(true);
    setIsLinkModalOpen(true);
  };

  const applyLink = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLinkModalOpen(false);
    restoreSelection();

    if (!linkUrl) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      // If no text selected, insert the link URL as text
      const anchor = document.createElement('a');
      anchor.href = linkUrl;
      anchor.textContent = linkUrl;
      if (openInNewTab) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }
      const range = sel ? sel.getRangeAt(0) : null;
      if (range) {
        range.insertNode(anchor);
      }
    } else {
      executeCommand('createLink', linkUrl);
      // Ensure target="_blank" and rel="noopener noreferrer" if requested
      if (openInNewTab && editorRef.current) {
        const anchors = editorRef.current.querySelectorAll('a');
        anchors.forEach(a => {
          if (a.getAttribute('href') === linkUrl) {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
          }
        });
      }
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const removeLink = () => {
    executeCommand('unlink');
  };

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="border border-slate-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-primary/50">
        {/* Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1 items-center">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            title="Bold (Ctrl+B)"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            title="Italic (Ctrl+I)"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            title="Underline (Ctrl+U)"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => formatBlock('h2')}
            title="Heading 2"
            className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => formatBlock('h3')}
            title="Heading 3"
            className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => formatBlock('p')}
            title="Paragraph"
            className="px-2 py-1 text-xs font-medium rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            P
          </button>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            title="Bullet List"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            title="Numbered List"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={openLinkDialog}
            title="Insert Link"
            className="p-1.5 rounded hover:bg-slate-200 text-brand-primary font-bold transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={removeLink}
            title="Remove Link"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Unlink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            title="Clear Formatting"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors ml-auto"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="p-4 min-h-[220px] max-h-[450px] overflow-y-auto outline-none text-sm text-slate-800 leading-relaxed prose max-w-none"
          style={{ whiteSpace: 'pre-wrap' }}
          data-placeholder={placeholder}
        />
      </div>

      {/* Link Dialog Modal */}
      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title="Insert / Edit Hyperlink">
        <form onSubmit={applyLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Link URL *</label>
            <input
              type="url"
              required
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com/programs"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary/50 outline-none font-mono"
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
            <label htmlFor="openInNewTab" className="text-sm text-slate-700 font-medium">
              Open link in new tab (`target="_blank" rel="noopener noreferrer"`)
            </label>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsLinkModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Insert Link</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
