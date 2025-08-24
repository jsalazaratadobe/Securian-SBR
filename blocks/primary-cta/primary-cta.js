export default function decorate(block) {
  // grab key elements
  const bgEl     = block.querySelector('.primary-cta__bg');
  const linkEl   = block.querySelector('.primary-cta__btn-link');
  const btnEl    = block.querySelector('.primary-cta__button');
  const imgEl    = block.querySelector('.primary-cta__img-prop');

  // --- 1) Paint background from the referenced image ---
  const setBgFromImg = () => {
    if (!imgEl) return;
    const src = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || '';
    if (src && bgEl) {
      bgEl.style.backgroundImage = `url("${src}")`;
    }
  };
  setBgFromImg();

  // observe changes to image src (UE updates it)
  if (imgEl) {
    const moImg = new MutationObserver(setBgFromImg);
    moImg.observe(imgEl, { attributes: true, attributeFilter: ['src', 'data-src'] });
  }

  // --- 2) Keep the button href in sync with the hidden link text ---
  const syncHref = () => {
    if (!linkEl || !btnEl) return;
    const url = (linkEl.textContent || '').trim();
    btnEl.setAttribute('href', url || '#');
    btnEl.setAttribute('aria-label', btnEl.textContent.trim());
  };
  syncHref();

  if (linkEl) {
    const moLink = new MutationObserver(syncHref);
    moLink.observe(linkEl, { childList: true, subtree: true, characterData: true });
  }

  // Defensive: if author pastes an <img> directly inside the block,
  // convert it to background then remove it to avoid double-visuals.
  const strayImg = block.querySelector(':scope > img');
  if (strayImg && bgEl) {
    bgEl.style.backgroundImage = `url("${strayImg.src}")`;
    strayImg.remove();
  }
}
