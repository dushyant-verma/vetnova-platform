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
  const lastHtmlRef = useRef<string>('');
  const savedRangeRef = useRef<Range | null>(null);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [activeAnchor, setActiveAnchor] = useState<HTMLAnchorElement | null>(null);

  // Initialize and sync HTML content ONLY when value is changed externally (e.g. form reset or modal open)
  useEffect(() => {
    if (editorRef.current && value !== lastHtmlRef.current) {
      editorRef.current.innerHTML = value || '';
      lastHtmlRef.current = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      lastHtmlRef.current = currentHtml;
      onChange(currentHtml);
    }
  };

  const executeCommand = (command: string, val: string = '') => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const formatBlock = (tag: string) => {
    executeCommand('formatBlock', `<${tag}>`);
  };

  const findParentAnchor = (): HTMLAnchorElement | null => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }
    while (node && node !== editorRef.current) {
      if (node.nodeName.toLowerCase() === 'a') {
        return node as HTMLAnchorElement;
      }
      node = node.parentNode;
    }
    return null;
  };

  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
  };

  const openLinkDialog = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    saveCurrentSelection();
    const existingAnchor = findParentAnchor();
    setActiveAnchor(existingAnchor);

    if (existingAnchor) {
      setLinkUrl(existingAnchor.getAttribute('href') || 'https://');
      setLinkText(existingAnchor.textContent || '');
      setOpenInNewTab(existingAnchor.getAttribute('target') === '_blank');
    } else {
      const sel = window.getSelection();
      const selectedText = sel ? sel.toString() : '';
      setLinkText(selectedText);
      setLinkUrl('https://');
      setOpenInNewTab(true);
    }

    setIsLinkModalOpen(true);
  };

  const applyLink = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLinkModalOpen(false);
    restoreSelection();

    if (!linkUrl) return;

    if (activeAnchor) {
      // Update existing anchor element directly in DOM
      activeAnchor.setAttribute('href', linkUrl);
      if (linkText) {
        activeAnchor.textContent = linkText;
      }
      if (openInNewTab) {
        activeAnchor.setAttribute('target', '_blank');
        activeAnchor.setAttribute('rel', 'noopener noreferrer');
      } else {
        activeAnchor.removeAttribute('target');
        activeAnchor.removeAttribute('rel');
      }
    } else {
      // Insert new hyperlink
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        const anchor = document.createElement('a');
        anchor.href = linkUrl;
        anchor.textContent = linkText || linkUrl;
        if (openInNewTab) {
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
        }
        const range = savedRangeRef.current || (sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null);
        if (range) {
          range.insertNode(anchor);
        } else if (editorRef.current) {
          editorRef.current.appendChild(anchor);
        }
      } else {
        executeCommand('createLink', linkUrl);
        if (editorRef.current) {
          const anchors = editorRef.current.querySelectorAll('a');
          anchors.forEach(a => {
            if (a.getAttribute('href') === linkUrl) {
              if (linkText) a.textContent = linkText;
              if (openInNewTab) {
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener noreferrer');
              }
            }
          });
        }
      }
    }

    handleInput();
  };

  const removeLink = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsLinkModalOpen(false);
    restoreSelection();
    if (activeAnchor) {
      const parent = activeAnchor.parentNode;
      while (activeAnchor.firstChild) {
        parent?.insertBefore(activeAnchor.firstChild, activeAnchor);
      }
      parent?.removeChild(activeAnchor);
    } else {
      executeCommand('unlink');
    }
    handleInput();
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

          {/* Full H1 - H6 Heading Formatting Options */}
          <button
            type="button"
            onClick={() => formatBlock('h1')}
            title="Heading 1"
            className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-0.5"
          >
            <Heading1 className="w-3.5 h-3.5" /> H1
          </button>
          <button
            type="button"
            onClick={() => formatBlock('h2')}
            title="Heading 2"
            className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-0.5"
          >
            <Heading2 className="w-3.5 h-3.5" /> H2
          </button>
          <button
            type="button"
            onClick={() => formatBlock('h3')}
            title="Heading 3"
            className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-0.5"
          >
            <Heading3 className="w-3.5 h-3.5" /> H3
          </button>
          <button
            type="button"
            onClick={() => formatBlock('h4')}
            title="Heading 4"
            className="px-2 py-1 text-xs font-semibold rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            H4
          </button>
          <button
            type="button"
            onClick={() => formatBlock('h5')}
            title="Heading 5"
            className="px-2 py-1 text-xs font-semibold rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            H5
          </button>
          <button
            type="button"
            onClick={() => formatBlock('h6')}
            title="Heading 6"
            className="px-2 py-1 text-xs font-semibold rounded hover:bg-slate-200 text-slate-700 transition-colors"
          >
            H6
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
            title="Insert / Edit Link"
            className="p-1.5 rounded hover:bg-slate-200 text-brand-primary font-bold transition-colors flex items-center gap-1 text-xs"
          >
            <LinkIcon className="w-4 h-4" /> Link
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
          onClick={() => {
            const anchor = findParentAnchor();
            if (anchor) setActiveAnchor(anchor);
          }}
          className="p-4 min-h-[220px] max-h-[450px] overflow-y-auto outline-none text-sm text-slate-800 leading-relaxed prose max-w-none"
          data-placeholder={placeholder}
        />
      </div>

      {/* Enhanced Link Dialog Modal */}
      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title={activeAnchor ? 'Edit Existing Hyperlink' : 'Insert Hyperlink'}>
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
            <label htmlFor="openInNewTab" className="text-sm text-slate-700 font-medium">
              Open link in new tab (`target="_blank" rel="noopener noreferrer"`)
            </label>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-slate-100">
            {activeAnchor ? (
              <Button type="button" variant="outline" onClick={removeLink} className="text-red-600 border-red-200 hover:bg-red-50">
                Remove Link
              </Button>
            ) : <div />}
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsLinkModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {activeAnchor ? 'Update Link' : 'Insert Link'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
