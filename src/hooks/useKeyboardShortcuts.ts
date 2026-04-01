/**
 * Keyboard Shortcuts Hook
 *
 * Provides global keyboard shortcuts for navigation.
 * Use in App.tsx to enable Alt+Key shortcuts.
 */

import { useEffect } from 'react';
import { createKeyboardShortcut } from '../utils/keyboardHelpers';

export function useKeyboardShortcuts(onNavigate: (page: string) => void) {
  useEffect(() => {
    const shortcuts = [
      { key: 'h', handler: () => onNavigate('home'), alt: true },
      { key: 'e', handler: () => onNavigate('education'), alt: true },
      { key: 'f', handler: () => onNavigate('founders'), alt: true },
      { key: 'l', handler: () => onNavigate('hall-of-fame'), alt: true },
      { key: 's', handler: () => onNavigate('submit'), alt: true },
    ];

    const listeners = shortcuts.map(({ key, handler, alt }) =>
      createKeyboardShortcut(key, handler, { alt })
    );

    listeners.forEach((listener) => {
      document.addEventListener('keydown', listener);
    });

    return () => {
      listeners.forEach((listener) => {
        document.removeEventListener('keydown', listener);
      });
    };
  }, [onNavigate]);
}
