export default function decorate(block) {
  // 1) ensure a single background element
  let bg = block.querySelector('.primary-cta-bg') ||
           block.querySelector('.primary-cta-background');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'primary-cta-bg';
    block.prepend(bg);
  }

  // 2) extract a pasted image/picture into CSS background
  const pic = block.querySelector('picture, img');
  if (pic) {
    const img = pic.querySelector('img') || pic; // tolerate either
    const url = img?.src;
    if (url) {
      bg.style.setProperty('--bg-url', `url("${url}")`);
    }
    // remove the inline graphic so it doesn’t overlay the content
    pic.remove();
  }

  // 3) keep button href in sync with hidden link field
  const linkSpan = block.querySelector('[data-rich-text="ctaLink"]');
  const ctaButton = block.querySelector('.cta-button');
  const syncHref = () => {
    if (!linkSpan || !ctaButton) return;
    const v = (linkSpan.textContent || '').trim();
    if (v) ctaButton.setAttribute('href', v);
  };
  syncHref();
  if (linkSpan) {
    new MutationObserver(syncHref).observe(linkSpan, {
      childList: true, subtree: true, characterData: true,
    });
  }

  // 4) keep aria-label aligned with button text for AT
  const ctaTextSpan = block.querySelector('.cta-button [data-rich-text="ctaText"]');
  const syncAria = () => {
    if (ctaButton && ctaTextSpan) {
      ctaButton.setAttribute('aria-label', ctaTextSpan.textContent.trim());
    }
  };
  syncAria();
  if (ctaTextSpan) {
    new MutationObserver(syncAria).observe(ctaTextSpan, {
      childList: true, subtree: true, characterData: true,
    });
  }
}
