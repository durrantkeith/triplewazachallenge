/**
 * Keyboard Shortcuts Help Dialog
 *
 * Displays available keyboard shortcuts to users.
 * Triggered by pressing '?' or Shift+/
 */

import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { isEscapeKey } from '../utils/keyboardHelpers';

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['Tab'], description: 'Move to next interactive element' },
      { keys: ['Shift', 'Tab'], description: 'Move to previous interactive element' },
      { keys: ['Enter'], description: 'Activate button or link' },
      { keys: ['Space'], description: 'Activate button' },
      { keys: ['Esc'], description: 'Close dialog or menu' },
    ],
  },
  {
    title: 'Page Navigation',
    shortcuts: [
      { keys: ['Alt', 'H'], description: 'Go to home page' },
      { keys: ['Alt', 'E'], description: 'Go to education page' },
      { keys: ['Alt', 'F'], description: 'Go to founders page' },
      { keys: ['Alt', 'L'], description: 'Go to hall of fame' },
      { keys: ['Alt', 'S'], description: 'Go to submission form' },
    ],
  },
  {
    title: 'Accordions',
    shortcuts: [
      { keys: ['↑'], description: 'Move to previous accordion' },
      { keys: ['↓'], description: 'Move to next accordion' },
      { keys: ['Home'], description: 'Move to first accordion' },
      { keys: ['End'], description: 'Move to last accordion' },
    ],
  },
];

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with '?' or Shift+/
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close with Escape
      if (isEscapeKey(e) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-slate-800 text-white p-3 rounded-full shadow-lg hover:bg-slate-700 transition-colors z-40"
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (Shift + ?)"
      >
        <Keyboard size={24} />
      </button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto z-50">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Keyboard className="text-blue-600" size={28} />
            <h2 id="shortcuts-title" className="text-2xl font-bold text-slate-900">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-lg font-bold text-slate-900 mb-4">{group.title}</h3>
              <div className="space-y-3">
                {group.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-slate-700">{shortcut.description}</span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center">
                          <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 rounded text-sm font-mono text-slate-800">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-slate-400">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Press <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono">Shift</kbd> + <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono">?</kbd> at any time to view these shortcuts.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
