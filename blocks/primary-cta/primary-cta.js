export default function decorate(block) {
  // Ensure structure exists even if the author pasted something odd
  if (!block.querySelector('.primary-cta-background')) {
    const bg = document.createElement('div');
    bg.className = 'primary-cta-background';
    block.prepend(bg);
  }

  // Turn any leading <img> into a CSS background and remove it
  const inlineImg = block.querySelector('img');
  const bgEl = block.querySelector('.primary-cta-background');
  if (inlineImg && bgEl) {
    bgEl.style.setProperty('--bg-url', `url("${inlineImg.src}")`);
    inlineImg.remove();
  }

  // Keep the CTA <a> href in sync with the hidden data-rich-text="ctaLink"
  const linkSpan = block.querySelector('[data-rich-text="ctaLink"]');
  const buttonEl = block.querySelector('.cta-button');
  if (linkSpan && buttonEl) {
    // Initialize from current text value
    const setHref = () => {
      const url = (linkSpan.textContent || '').trim();
      if (url) buttonEl.setAttribute('href', url);
    };
    setHref();

    const mo = new MutationObserver(setHref);
    mo.observe(linkSpan, { childList: true, subtree: true, characterData: true });
  }

  // Optional: set aria-label on the button using its visible text for accessibility
  const buttonTextSpan = block.querySelector('.cta-button [data-rich-text="ctaText"]');
  if (buttonTextSpan && buttonEl) {
    const syncAria = () => buttonEl.setAttribute('aria-label', buttonTextSpan.textContent.trim());
    syncAria();
    const mo2 = new MutationObserver(syncAria);
    mo2.observe(buttonTextSpan, { childList: true, subtree: true, characterData: true });
  }
}
