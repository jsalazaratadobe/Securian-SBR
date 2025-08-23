export default function decorate(block) {
  // --- 1) Normalize/prepare structure ---

  // If an old background div exists, keep & reuse; otherwise create a new one
  let bgEl = block.querySelector('.primary-cta-bg') 
            || block.querySelector('.primary-cta-background');

  if (!bgEl) {
    bgEl = document.createElement('div');
    bgEl.className = 'primary-cta-bg'; // new normalized class
    block.prepend(bgEl);
  } else {
    // Normalize the class so CSS can target consistently
    bgEl.classList.add('primary-cta-bg');
  }

  // Create a content wrapper if not already present
  let content = block.querySelector('.primary-cta-content');
  if (!content) {
    content = document.createElement('div');
    content.className = 'primary-cta-content';

    // Move all non-bg, non-picture children into the content wrapper
    [...block.children].forEach((child) => {
      if (child !== bgEl && !child.matches('picture')) content.appendChild(child);
    });

    block.appendChild(content);
  }

  // --- 2) Background image layering ---
  // Prefer a <picture><img> authored by UE; else keep CSS var fallback for old CSS
  const picture = block.querySelector('picture');
  const inlineImg = picture?.querySelector('img') || block.querySelector(':scope > img');

  if (inlineImg) {
    // Absolute background with URL
    bgEl.style.backgroundImage = `url("${inlineImg.src}")`;
    // If older CSS used a custom prop, keep it populated too (harmless if unused)
    bgEl.style.setProperty('--bg-url', `url("${inlineImg.src}")`);
    // Remove the inline image/picture so it never sits on top of text
    if (picture) picture.remove();
    else inlineImg.remove();
  }

  // Ensure bg is a true background layer
  bgEl.style.position = 'absolute';
  bgEl.style.inset = '0';
  bgEl.style.zIndex = '1';

  // --- 3) Keep UE button link in sync with the editable field ---
  // We look for a span marked data-rich-text="ctaLink" & a visible button
  const buttonEl = block.querySelector('.cta-button, a.button, a.cta');
  const linkSpan = block.querySelector('[data-rich-text="ctaLink"]');

  if (linkSpan && buttonEl) {
    const setHref = () => {
      const url = (linkSpan.textContent || '').trim();
      if (url) buttonEl.setAttribute('href', url);
    };
    setHref();
    const mo = new MutationObserver(setHref);
    mo.observe(linkSpan, { childList: true, subtree: true, characterData: true });
  }

  // --- 4) Optional accessibility: sync aria-label from the visible button text ---
  const buttonTextSpan =
    block.querySelector('.cta-button [data-rich-text="ctaText"]') ||
    block.querySelector('a.button [data-rich-text="ctaText"]') ||
    block.querySelector('a.cta [data-rich-text="ctaText"]');

  if (buttonTextSpan && buttonEl) {
    const syncAria = () => buttonEl.setAttribute('aria-label', buttonTextSpan.textContent.trim());
    syncAria();
    const mo2 = new MutationObserver(syncAria);
    mo2.observe(buttonTextSpan, { childList: true, subtree: true, characterData: true });
  }

  // --- 5) Tag for styling and make sure content is above bg ---
  block.classList.add('primary-cta');
  content.style.position = 'relative';
  content.style.zIndex = '3';
}
