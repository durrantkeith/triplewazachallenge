/**
 * SkipLink Component
 *
 * Provides a keyboard-accessible link to skip navigation and jump directly
 * to main content. This is essential for screen reader and keyboard users
 * who don't want to tab through the entire navigation on every page.
 *
 * Usage: Place at the very top of your app before Navigation component
 */

export default function SkipLink() {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');

    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a
      href="#main-content"
      className="skip-link"
      onClick={handleSkip}
    >
      Skip to main content
    </a>
  );
}
