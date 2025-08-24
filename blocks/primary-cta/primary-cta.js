export default function decorate(block) {
  // Ensure required shells exist
  let bg = block.querySelector('.primary-cta-background');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'primary-cta-background';
    block.prepend(bg);
  }
  let content = block.querySelector('.primary-cta-content');
  if (!content) {
    content = document.createElement('div');
    content.className = 'primary-cta-content';
    block.append(content);
  }

  // Promote inline <img> to CSS background
  const inlineImg = block.querySelector('img');
  if (inlineImg) {
    bg.style.setProperty('--bg-url', `url("${inlineImg.src}")`);
    inlineImg.closest('picture')?.remove();
  }

  // Ensure the editable anchors exist (so UE form/inline can bind)
  const ensureAnchor = (sel, tag, cls, rich) => {
    let el = block.querySelector(sel);
    if (!el) {
      el = document.createElement(tag);
      if (cls) el.className = cls;
      if (rich) el.setAttribute('data-rich-text', rich);
      content.append(el);
    }
    return el;
  };

  const titleEl   = ensureAnchor('[data-rich-text="title"]',   'h2', 'primary-cta-title', 'title');
  const bodyEl    = ensureAnchor('[data-rich-text="body"]',    'p',  'primary-cta-body',  'body');
  const ctaTextEl = ensureAnchor('[data-rich-text="ctaText"]', 'span','sr-only',          'ctaText');
  const ctaLinkEl = ensureAnchor('[data-rich-text="ctaLink"]', 'span','sr-only',          'ctaLink');

  // Ensure visible button exists
  let button = block.querySelector('.cta-button');
  if (!button) {
    button = document.createElement('a');
    button.className = 'cta-button';
    button.setAttribute('role', 'button');
    button.href = '#';
    button.textContent = 'Learn More';
    content.append(button);
  }

  // Sync helpers
  const syncHref = () => {
    const url = (ctaLinkEl.textContent || '').trim();
    if (url) button.setAttribute('href', url);
  };
  const syncLabel = () => {
    const label = (ctaTextEl.textContent || '').trim() || 'Learn More';
    button.textContent = label;
    button.setAttribute('aria-label', label);
  };

  // Initial sync
  syncHref();
  syncLabel();

  // Live sync when UE edits the spans
  const mo1 = new MutationObserver(syncHref);
  mo1.observe(ctaLinkEl, { childList: true, subtree: true, characterData: true });

  const mo2 = new MutationObserver(syncLabel);
  mo2.observe(ctaTextEl, { childList: true, subtree: true, characterData: true });
}
