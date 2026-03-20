/**
 * Keyboard Navigation Helper Utilities
 *
 * Provides reusable functions for handling keyboard events
 * and improving keyboard accessibility throughout the application.
 */

/**
 * Check if key pressed is Enter or Space (activation keys)
 */
export function isActivationKey(event: React.KeyboardEvent): boolean {
  return event.key === 'Enter' || event.key === ' ';
}

/**
 * Check if Escape key was pressed
 */
export function isEscapeKey(event: React.KeyboardEvent | KeyboardEvent): boolean {
  return event.key === 'Escape' || event.key === 'Esc';
}

/**
 * Check if arrow keys were pressed
 */
export function getArrowKeyDirection(event: React.KeyboardEvent): 'up' | 'down' | 'left' | 'right' | null {
  switch (event.key) {
    case 'ArrowUp': return 'up';
    case 'ArrowDown': return 'down';
    case 'ArrowLeft': return 'left';
    case 'ArrowRight': return 'right';
    default: return null;
  }
}

/**
 * Focus trap for modals and dialogs
 * Keeps keyboard focus within a container element
 */
export function createFocusTrap(containerElement: HTMLElement) {
  const focusableElements = containerElement.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  containerElement.addEventListener('keydown', handleKeyDown);

  // Focus first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    containerElement.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Manage focus when opening/closing menus
 */
export function saveFocusAndRestore(action: () => void) {
  const activeElement = document.activeElement as HTMLElement;

  action();

  return () => {
    activeElement?.focus();
  };
}

/**
 * Handle accordion keyboard navigation
 */
export function handleAccordionKeyboard(
  event: React.KeyboardEvent,
  onToggle: () => void,
  isExpanded: boolean
) {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      onToggle();
      break;
    case 'ArrowDown':
    case 'ArrowUp':
      // Move to next/previous accordion item
      event.preventDefault();
      const currentButton = event.currentTarget as HTMLElement;
      const allButtons = Array.from(
        document.querySelectorAll('[role="button"][aria-expanded]')
      ) as HTMLElement[];
      const currentIndex = allButtons.indexOf(currentButton);

      if (event.key === 'ArrowDown') {
        const nextButton = allButtons[currentIndex + 1] || allButtons[0];
        nextButton?.focus();
      } else {
        const prevButton = allButtons[currentIndex - 1] || allButtons[allButtons.length - 1];
        prevButton?.focus();
      }
      break;
    case 'Home':
      event.preventDefault();
      const firstButton = document.querySelector('[role="button"][aria-expanded]') as HTMLElement;
      firstButton?.focus();
      break;
    case 'End':
      event.preventDefault();
      const buttons = document.querySelectorAll('[role="button"][aria-expanded]');
      const lastButton = buttons[buttons.length - 1] as HTMLElement;
      lastButton?.focus();
      break;
  }
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Create keyboard shortcut handler
 */
export function createKeyboardShortcut(
  key: string,
  callback: () => void,
  options: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  } = {}
) {
  return (event: KeyboardEvent) => {
    const matchesModifiers =
      (!options.ctrl || event.ctrlKey) &&
      (!options.shift || event.shiftKey) &&
      (!options.alt || event.altKey);

    if (event.key.toLowerCase() === key.toLowerCase() && matchesModifiers) {
      event.preventDefault();
      callback();
    }
  };
}
