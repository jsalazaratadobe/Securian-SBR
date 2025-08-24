function getAssetUrl(imgContainer) {
  if (!imgContainer) return '';
  // When UE injects the asset, it typically adds an <img> or <picture><img>
  const img = imgContainer.querySelector('img');
  if (img && img.src) return img.src;

  // fallback: some variants use <source srcset="...">
  const source = imgContainer.querySelector('source[srcset]');
  if (source) {
    const set = source.getAttribute('srcset') || '';
    // grab the first URL from srcset
    const first = set.split(',')[0]?.trim().split(' ')[0];
    return first || '';
  }
  return '';
}

function setBackgroundFromContainer(bgEl, imgContainer) {
  const url = getAssetUrl(imgContainer);
  if (url && bgEl) bgEl.style.backgroundImage = `url("${url}")`;
}

function syncButtonHref(button, linkContainer) {
  if (!button || !linkContainer) return;
  // UE might inject an <a>, or text content with a path
  const a = linkContainer.querySelector('a[href]');
  const raw = (linkContainer.textContent || '').trim();
  const href = a?.getAttribute('href') || raw || '#';
  button.setAttribute('href', href);
  button.setAttribute('aria-label', button.textContent.trim());
}

export default function decorate(block) {
  const bgEl     = block.querySelector('.primary-cta__bg');
  const linkBox  = block.querySelector('.primary-cta__btn-link');
  const btnEl    = block.querySelector('.primary-cta__button');
  const imgBox   = block.querySelector('.primary-cta__image');

  // 1) Background image from UE-injected asset
  setBackgroundFromContainer(bgEl, imgBox);
  if (imgBox) {
    const moImg = new MutationObserver(() => setBackgroundFromContainer(bgEl, imgBox));
    moImg.observe(imgBox, { childList: true, subtree: true, attributes: true });
  }

  syncButtonHref(btnEl, btnLink);
  if (btnLink) {
    const moLink = new MutationObserver(() => syncButtonHref(btnEl, btnLink));
    moLink.observe(btnLink, { childList: true, subtree: true, attributes: true, characterData: true });
  }

  // 3) Defensive: if an author pasted an <img> directly, convert to bg
  const strayImg = block.querySelector(':scope > img');
  if (strayImg && bgEl) {
    bgEl.style.backgroundImage = `url("${strayImg.src}")`;
    strayImg.remove();
  }
}
