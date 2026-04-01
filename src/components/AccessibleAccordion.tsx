/**
 * Accessible Accordion Component
 *
 * Example implementation for the Hall of Fame country accordions.
 * Includes proper ARIA attributes and keyboard navigation.
 *
 * Use this pattern to update the HallOfFame.tsx accordion buttons
 */

import { ChevronDown, ChevronRight } from 'lucide-react';
import { handleAccordionKeyboard } from '../utils/keyboardHelpers';

interface AccordionItemProps {
  id: string;
  title: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function AccessibleAccordion({
  id,
  title,
  count,
  isExpanded,
  onToggle,
  children,
}: AccordionItemProps) {
  const buttonId = `accordion-button-${id}`;
  const panelId = `accordion-panel-${id}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3>
        <button
          id={buttonId}
          onClick={onToggle}
          onKeyDown={(e) => handleAccordionKeyboard(e, onToggle, isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          type="button"
        >
          <div className="flex items-center space-x-3">
            {isExpanded ? (
              <ChevronDown className="text-slate-600" size={24} aria-hidden="true" />
            ) : (
              <ChevronRight className="text-slate-600" size={24} aria-hidden="true" />
            )}
            <span className="text-xl font-bold text-slate-900">{title}</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {count} {count === 1 ? 'Video' : 'Videos'}
            </span>
          </div>
          <span className="sr-only">
            {isExpanded ? 'Collapse' : 'Expand'} {title} section
          </span>
        </button>
      </h3>

      {isExpanded && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="px-6 pb-4 space-y-4"
        >
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Usage example in HallOfFame.tsx:
 *
 * <AccessibleAccordion
 *   id={country.toLowerCase().replace(/\s+/g, '-')}
 *   title={country}
 *   count={countrySubmissions.length}
 *   isExpanded={expandedCountries.has(country)}
 *   onToggle={() => toggleCountry(country)}
 * >
 *   {countrySubmissions.map((submission) => (
 *     // ... submission content
 *   ))}
 * </AccessibleAccordion>
 */
