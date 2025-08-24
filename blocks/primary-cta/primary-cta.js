export default function decorate(block) {
  const wrapper = block.closest('.primary-cta-wrapper') || block;
  const img = wrapper.querySelector('.primary-cta-img');
  const content = wrapper.querySelector('.primary-cta-content');
  const btn = content?.querySelector('.cta-button');
  const btnTextSpan = content?.querySelector('[data-aue-prop="btn-text"]');
  const btnLinkSpan = content?.querySelector('[data-aue-prop="btn-link"]');
  const altSpan = content?.querySelector('[data-aue-prop="alt"]');

  // 1) Background image via CSS var (keep the <img> for UE mapping)
  const setBg = () => {
    const src = img?.getAttribute('src') || '';
    if (src) wrapper.style.setProperty('--bg-url', `url("${src}")`);
  };
  setBg();

  // Observe image mutations (UE replaces the src)
  if (img) {
    const moImg = new MutationObserver(setBg);
    moImg.observe(img, { attributes: true, attributeFilter: ['src'] });
  }

  // 2) Sync button href from hidden span
  const setHref = () => {
    if (!btn || !btnLinkSpan) return;
    const url = (btnLinkSpan.textContent || '').trim();
    if (url) btn.setAttribute('href', url);
  };
  setHref();

  if (btnLinkSpan) {
    const moLink = new MutationObserver(setHref);
    moLink.observe(btnLinkSpan, { childList: true, subtree: true, characterData: true });
  }

  // 3) Keep aria-label in sync with button text for a11y
  const setAria = () => {
    if (btn && btnTextSpan) {
      const t = (btnTextSpan.textContent || '').trim();
      if (t) btn.setAttribute('aria-label', t);
    }
  };
  setAria();

  if (btnTextSpan) {
    const moText = new MutationObserver(setAria);
    moText.observe(btnTextSpan, { childList: true, subtree: true, characterData: true });
  }

  // 4) Optional: use "alt" as a label for the region
  const setAlt = () => {
    if (altSpan) {
      const a = (altSpan.textContent || '').trim();
      if (a) wrapper.setAttribute('aria-label', a);
    }
  };
  setAlt();

  if (altSpan) {
    const moAlt = new MutationObserver(setAlt);
    moAlt.observe(altSpan, { childList: true, subtree: true, characterData: true });
  }
}
