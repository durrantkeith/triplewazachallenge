# Keyboard Accessibility Implementation Guide

## Quick Start

This guide walks you through implementing the keyboard accessibility improvements step by step.

## Phase 1: Critical Improvements (2-4 hours)

### Step 1: Add Focus Styles

1. Import the focus styles in your main CSS file:

```css
/* Add to src/index.css at the top */
@import './styles/focus.css';

/* Also add the screen reader only utility class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Step 2: Add Skip Link

Update `src/App.tsx`:

```tsx
import SkipLink from './components/SkipLink';

function App() {
  // ... existing code

  return (
    <div className="min-h-screen bg-slate-50">
      <SkipLink />
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main id="main-content" tabIndex={-1}>
        {renderPage()}
      </main>
      {/* ... rest of code */}
    </div>
  );
}
```

### Step 3: Update Navigation

Replace `src/components/Navigation.tsx` with `AccessibleNavigation.tsx`:

```bash
# Backup old file
mv src/components/Navigation.tsx src/components/Navigation.tsx.backup

# Rename new file
mv src/components/AccessibleNavigation.tsx src/components/Navigation.tsx
```

Or manually copy the improved code from `AccessibleNavigation.tsx`.

### Step 4: Add Keyboard Shortcuts Help

Update `src/App.tsx` to include the keyboard shortcuts dialog:

```tsx
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';

function App() {
  // ... existing code

  return (
    <div className="min-h-screen bg-slate-50">
      <SkipLink />
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main id="main-content" tabIndex={-1}>
        {renderPage()}
      </main>
      <footer>
        {/* ... footer content */}
      </footer>
      <KeyboardShortcutsHelp />
    </div>
  );
}
```

## Phase 2: Component Updates (4-6 hours)

### Update Hall of Fame Accordions

In `src/components/HallOfFame.tsx`, replace the accordion button implementation:

**Before:**
```tsx
<button
  onClick={() => toggleCountry(country)}
  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
>
  {/* ... content */}
</button>
```

**After:**
```tsx
import { handleAccordionKeyboard } from '../utils/keyboardHelpers';

<button
  onClick={() => toggleCountry(country)}
  onKeyDown={(e) => handleAccordionKeyboard(e, () => toggleCountry(country), isCountryExpanded)}
  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
  aria-expanded={isCountryExpanded}
  aria-controls={`country-panel-${country}`}
  type="button"
>
  <div className="flex items-center space-x-3">
    {isCountryExpanded ? (
      <ChevronDown className="text-slate-600" size={24} aria-hidden="true" />
    ) : (
      <ChevronRight className="text-slate-600" size={24} aria-hidden="true" />
    )}
    <span className="text-xl font-bold text-slate-900">{country}</span>
    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
      {countrySubmissions.length} {countrySubmissions.length === 1 ? 'Video' : 'Videos'}
    </span>
  </div>
  <span className="sr-only">
    {isCountryExpanded ? 'Collapse' : 'Expand'} {country} section
  </span>
</button>

{isCountryExpanded && (
  <div
    id={`country-panel-${country}`}
    role="region"
    aria-label={`${country} submissions`}
    className="px-6 pb-4 space-y-4"
  >
    {/* ... existing content */}
  </div>
)}
```

### Update Submission Form

Add live regions for announcements in `src/components/SubmissionForm.tsx`:

```tsx
import LiveRegion from './LiveRegion';
import { useState } from 'react';

export default function SubmissionForm() {
  const [statusMessage, setStatusMessage] = useState('');

  // ... existing state

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setStatusMessage(''); // Clear previous messages

    try {
      // ... validation and submission logic

      setSuccess(true);
      setStatusMessage('Video submitted successfully! You will receive an email when approved.');

      // ... rest of success handling
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      setStatusMessage(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <LiveRegion message={statusMessage} priority="polite" clearAfter={5000} />

      {/* ... rest of component */}
    </div>
  );
}
```

### Update Education Page Upload Form

Replace the upload form with an accessible modal:

```tsx
import AccessibleModal from './AccessibleModal';

export default function EducationPage({ onNavigate }: EducationPageProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);

  // ... existing code

  return (
    <div>
      {/* ... existing content */}

      <AccessibleModal
        isOpen={showUploadForm}
        onClose={() => setShowUploadForm(false)}
        title="Add Educational Video"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          {/* Move form fields here */}
        </form>
      </AccessibleModal>
    </div>
  );
}
```

### Update Admin Dashboard

Add keyboard navigation for pagination and bulk actions:

```tsx
// In AdminDashboard.tsx, add keyboard handlers for pagination

<button
  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
  onKeyDown={(e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCurrentPage(Math.max(1, currentPage - 1));
    }
  }}
  disabled={currentPage === 1}
  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  aria-label="Previous page"
>
  <ChevronLeft size={20} />
</button>

{/* Page buttons with better ARIA labels */}
{pageButtons.map((pageNum) => (
  <button
    key={pageNum}
    onClick={() => setCurrentPage(pageNum)}
    className={`px-4 py-2 rounded-lg transition-colors ${
      currentPage === pageNum
        ? 'bg-blue-600 text-white'
        : 'border border-slate-300 hover:bg-slate-50'
    }`}
    aria-label={`Go to page ${pageNum}`}
    aria-current={currentPage === pageNum ? 'page' : undefined}
  >
    {pageNum}
  </button>
))}

<button
  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
  onKeyDown={(e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setCurrentPage(Math.min(totalPages, currentPage + 1));
    }
  }}
  disabled={currentPage === totalPages}
  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  aria-label="Next page"
>
  <ChevronRight size={20} />
</button>
```

## Phase 3: Advanced Features (3-4 hours)

### Add Global Keyboard Shortcuts

Create `src/hooks/useKeyboardShortcuts.ts`:

```tsx
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
```

Use in `App.tsx`:

```tsx
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useKeyboardShortcuts(setCurrentPage);

  // ... rest of component
}
```

## Testing Checklist

After implementation, test the following:

### Keyboard Navigation
- [ ] Tab moves forward through all interactive elements
- [ ] Shift+Tab moves backward through all interactive elements
- [ ] Tab order is logical (follows visual order)
- [ ] Skip link appears on first Tab press
- [ ] Skip link jumps to main content when activated

### Focus Indicators
- [ ] All focused elements have visible outline
- [ ] Focus outline has sufficient contrast
- [ ] Focus is never hidden or lost

### Navigation
- [ ] All navigation items accessible via keyboard
- [ ] Current page is announced to screen readers
- [ ] Mobile menu opens/closes with keyboard
- [ ] Escape closes mobile menu
- [ ] Focus returns to menu button when menu closes

### Accordions (Hall of Fame)
- [ ] Space/Enter toggles accordion
- [ ] Arrow Up/Down navigates between accordions
- [ ] Home/End keys jump to first/last accordion
- [ ] Expanded state is announced

### Forms
- [ ] All form fields are keyboard accessible
- [ ] Labels are properly associated with inputs
- [ ] Error messages are announced
- [ ] Success messages are announced
- [ ] Submit button is keyboard accessible

### Modals
- [ ] Focus moves to modal when opened
- [ ] Tab cycles through modal elements only (focus trap)
- [ ] Escape closes modal
- [ ] Focus returns to trigger element when closed

### Admin Dashboard
- [ ] All filter buttons are keyboard accessible
- [ ] Pagination works with keyboard
- [ ] Checkboxes can be toggled with Space
- [ ] Video play buttons are keyboard accessible

## Browser Testing

Test in the following combinations:

1. **Windows:**
   - Chrome + NVDA
   - Firefox + NVDA
   - Edge + Narrator

2. **macOS:**
   - Safari + VoiceOver
   - Chrome + VoiceOver

3. **Mobile:**
   - iOS Safari + VoiceOver
   - Android Chrome + TalkBack

## Performance Considerations

- Focus styles are CSS-only (no JavaScript overhead)
- Keyboard helpers are tree-shakeable
- Live regions are only added when needed
- No impact on initial page load

## Common Issues and Solutions

### Issue: Focus outline cut off by overflow
**Solution:** Add `overflow: visible` to parent containers or use `outline-offset`.

### Issue: Focus lost after state change
**Solution:** Use refs to maintain focus or call `.focus()` on the element that should receive focus.

### Issue: Screen reader doesn't announce changes
**Solution:** Ensure ARIA live regions are present in DOM before message changes.

### Issue: Keyboard trap in modal not working
**Solution:** Verify modal is properly selecting focusable elements and first element gets focus.

## Resources

- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- WebAIM Keyboard Accessibility: https://webaim.org/techniques/keyboard/

## Support

If you encounter issues during implementation, check:
1. Browser console for errors
2. ARIA attributes in DevTools
3. Focus order using Tab key
4. Screen reader announcements
