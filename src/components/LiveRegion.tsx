/**
 * Live Region Component
 *
 * Announces dynamic content changes to screen readers.
 * Use for form submissions, loading states, error messages, etc.
 */

import { useEffect, useState } from 'react';

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number; // milliseconds
}

export default function LiveRegion({
  message,
  priority = 'polite',
  clearAfter = 0
}: LiveRegionProps) {
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    setDisplayMessage(message);

    if (clearAfter > 0 && message) {
      const timer = setTimeout(() => {
        setDisplayMessage('');
      }, clearAfter);

      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {displayMessage}
    </div>
  );
}

/**
 * Screen reader only utility class
 * Add this to index.css or focus.css:
 *
 * .sr-only {
 *   position: absolute;
 *   width: 1px;
 *   height: 1px;
 *   padding: 0;
 *   margin: -1px;
 *   overflow: hidden;
 *   clip: rect(0, 0, 0, 0);
 *   white-space: nowrap;
 *   border-width: 0;
 * }
 */

/**
 * Usage in SubmissionForm.tsx:
 *
 * const [statusMessage, setStatusMessage] = useState('');
 *
 * // After successful submission:
 * setStatusMessage('Video submitted successfully! You will receive an email when approved.');
 *
 * // In JSX:
 * <LiveRegion message={statusMessage} priority="polite" clearAfter={5000} />
 */
